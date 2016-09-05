import React from 'react';

import Modal from '../../../ui/modal';
import SignupModalContent from './signup-modal/signup-modal-content';
import LoginModalContent from './login-modal/login-modal-content';

require('../../../stylesheets/modules/user-auth.scss');
require('../../../stylesheets/utils/button.scss');

class UserAuth extends React.Component {
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

  _renderButton(label) {
    return (
      <button className='user-auth__button button-as-link'>{label}</button>
    )
  }

  render() {
    return (
      <div className='user-auth'>
        <Modal ref="signupModal"
               targetButton={this._renderButton('Sign Up')}
               title="Sign Up"
               containerClassNames='user-auth__modal'
               contentClassNames="signup-modal">
          <SignupModalContent transitToLogin={this._handleSignupTransitToLogin.bind(this)}/>
        </Modal>
        <Modal ref="loginModal"
               targetButton={this._renderButton('Login')}
               title="Login"
               containerClassNames='user-auth__modal'
               contentClassNames="login-modal">
          <LoginModalContent transitToSignup={this._handleLoginTransitToSignup.bind(this)}
                             onLoginSuccess={this._handleLoginSuccess.bind(this)}/>
        </Modal>
      </div>
    )
  }
}

export default UserAuth
