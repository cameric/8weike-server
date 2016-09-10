import React from 'react';

import Modal from '../../../ui/modal';
import SignupModalContent from './signup-modal/signup-modal-content';
import LoginModalContent from './login-modal/login-modal-content';

require('../../../stylesheets/modules/user-auth.scss');
require('../../../stylesheets/utils/button.scss');

class UserAuth extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.uid && this.props.uid != nextProps.uid)
      this.props.loadProfileById();
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
    this.props.loadProfileById();
  }

  _handleSignupSuccess() {
    this.refs.signupModal.hideModal();
    this.props.loadProfileById();
  }

  _handleLogout() {
    this.props.logout();
  }

  _renderButton(label) {
    return (
      <button className='user-auth__button button-as-link'>{label}</button>
    )
  }

  _renderWithoutLogin() {
    return (
        <div className='user-auth'>
          <Modal ref="signupModal"
                 targetButton={this._renderButton('Sign Up')}
                 title="Sign Up"
                 containerClassNames='user-auth__modal'
                 contentClassNames="signup-modal">
            <SignupModalContent transitToLogin={this._handleSignupTransitToLogin.bind(this)}
                                onSignupSuccess={this._handleSignupSuccess.bind(this)}/>
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

  _renderWithLogin() {
    return (
        <div className='user-auth'>
          <span className="user-auth__button">{this.props.profile.nickname}</span>
          <button className='user-auth__button button-as-link'
                  onClick={this._handleLogout.bind(this)}>Logout</button>
        </div>)
  }

  _renderConditional() {
    // Initial payload. Does not render anything
    if (typeof this.props.uid === 'undefined') return null;
    // User logged in but profile hasn't finished loading. Render nothing to avoid flashing
    if (this.props.uid && !this.props.profile) return null;
    // User logged in and profile is loaded, update the nav bar
    if (this.props.uid) return this._renderWithLogin();
    // User hasn't logged in. Render signup/login
    return this._renderWithoutLogin();
  }

  render() {
    return (
        <div>
          {this._renderConditional()}
        </div>
    )
  }
}

export default UserAuth
