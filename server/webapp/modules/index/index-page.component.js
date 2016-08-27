// The index page

import React from 'react';
import DocumentTitle from 'react-document-title';

import { webRequestAction, constructInitialStatePayload } from '../../actions/utils';
import Modal from '../../ui/modal';
import SignupModalContent from './nav-bar/signup-modal/signup-modal-content.component';
import LoginModalContent from './nav-bar/login-modal/login-modal-content';

require('../../stylesheets/modules/index-page.scss');

class IndexPage extends React.Component {
  static fetchData({ store }) {
    return store.dispatch(webRequestAction(constructInitialStatePayload({
      method: 'GET',
      url: '/api/global_info',
    })))
  }

  constructor(props) {
    super(props);
    this.state = {
      uid: null,
    }
  }

  _handleLoginTransitToSignup() {
    this.refs.loginModal.hideModal();
    this.refs.signupModal.showModal();
  }

  _handleSignupTransitToLogin() {
    this.refs.signupModal.hideModal();
    this.refs.loginModal.showModal();
  }

  _handleLoginSuccess() {
    this.refs.loginModal.hideModal();
    this.props.loadUserById();
  }

  render() {
    return (
      <DocumentTitle title="8WeiKe - Index">
        <div>
          This is the index page of 8weike website. UserId: {this.state.uid}
          <span>Version: {this.props.globalInfo.version}</span>
          <span>Company: {this.props.globalInfo.company}</span>
          <Modal ref="signupModal"
                 targetButton={<button>Sign Up</button>}
                 title="Sign Up"
                 classNames="signup-modal">
            <SignupModalContent transitToLogin={this._handleSignupTransitToLogin.bind(this)}/>
          </Modal>
          <Modal ref="loginModal"
                 targetButton={<button>Login</button>}
                 title="Login"
                 classNames="login-modal">
            <LoginModalContent transitToSignup={this._handleLoginTransitToSignup.bind(this)}
                               onLoginSuccess={this._handleLoginSuccess.bind(this)}/>
          </Modal>
        </div>
      </DocumentTitle>
    )
  }
}

IndexPage.propTypes = {
  globalInfo: React.PropTypes.object,
  loadUserById: React.PropTypes.func,
};

export default IndexPage