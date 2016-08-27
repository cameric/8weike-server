// The index page

import React from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';

import { webRequestAction, constructInitialStatePayload } from '../../actions/utils';
import Modal from '../../ui/modal';
import SignupModalContent from '../containers/signup-modal-content';
import LoginModalContent from '../containers/login-modal-content';

require('../../stylesheets/modules/index-page.scss');

class IndexPage extends React.Component {
  static fetchData({ store }) {
    return store.dispatch(webRequestAction(constructInitialStatePayload({
      method: 'GET',
      url: '/api/global_info',
    })))
  }

  _onLoginTransitToSignup() {
    this.refs.loginModal.hideModal();
    this.refs.signupModal.showModal();
  }

  _onSignupTransitToLogin() {
    this.refs.signupModal.hideModal();
    this.refs.loginModal.showModal();
  }

  render() {
    return (
      <DocumentTitle title="8WeiKe - Index">
        <div>
          This is the index page of 8weike website.
          <li><Link to={'/login'}>Login Here</Link></li>
          <span>Version: {this.props.globalInfo.version}</span>
          <span>Company: {this.props.globalInfo.company}</span>
          <Modal ref="signupModal"
                 targetButton={<button>Sign Up</button>}
                 title="Sign Up"
                 classNames="signup-modal">
            <SignupModalContent transitToLogin={this._onSignupTransitToLogin.bind(this)}/>
          </Modal>
          <Modal ref="loginModal"
                 targetButton={<button>Login</button>}
                 title="Login"
                 classNames="login-modal">
            <LoginModalContent transitToSignup={this._onLoginTransitToSignup.bind(this)}/>
          </Modal>
        </div>
      </DocumentTitle>
    )
  }
}

IndexPage.propTypes = {
  globalInfo: React.PropTypes.object
};

export default IndexPage