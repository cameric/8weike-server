import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import { white } from 'material-ui/styles/colors';

import ErrorBanner from '../../../ui/error-banner';
import Input from '../../../ui/input';
import CreateProfileModal from '../../profile/create-profile-modal';

require('../../../stylesheets/modules/nav-bar/user-auth/login-modal-content.scss');

class LoginModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      password: '',
      shouldRememberPassword: false,
      status: 'waiting',
      shouldCreateProfile: false,
    };
  }

  // Handle login state updates

  componentWillReceiveProps(nextProps) {
    if (this.state.status === 'loading' &&
        nextProps.loginState !== this.props.loginState) {
      if (nextProps.loginState.status === 'error') {
        // Reset user input if error
        this.setState({ status: 'waiting' });
      } else if (nextProps.loginState.status === 'success') {
        if (nextProps.hasProfile) this.props.onLoginSuccess();
        else this.setState({ shouldCreateProfile: true });
      }
    }
  }

  // Controlled inputs helpers

  _updatePhone(phone) {
    this.setState({ phone });
  }

  _updatePassword(password) {
    this.setState({ password });
  }

  _updatePasswordRemember(event, isInputChecked) {
    this.setState({ shouldRememberPassword: isInputChecked });
  }

  // Helpers for conditional rendering

  _renderErrorMsg() {
    if (this.props.loginState && this.props.loginState.status === 'error') {
      return (
        <ErrorBanner errorMsg={this.props.loginState.error.message} />
      );
    }
    return null;
  }

  _renderLoginButton() {
    const buttonMsg = (this.state.status === 'waiting') ? __('Login')
        : (<CircularProgress color={white} size={0.3} style={{ marginTop: '-7px' }} />);
    return (
      <FlatButton
        backgroundColor="#00BCD4"
        hoverColor="#0CB6C9"
        disabled={this.state.status === 'loading'}
        onTouchTap={this._handleLoginWithPhone.bind(this)}
        style={{
          width: '100%',
          margin: '20px 0 20px 0',
          color: white,
        }}
      >{buttonMsg}</FlatButton>
    );
  }

  // Action handlers

  _handleLoginWithPhone() {
    const isPhoneValid = this.refs.phoneInput.validate();
    const isPasswordValid = this.refs.passwordInput.validate();
    if (isPhoneValid && isPasswordValid) {
      this.setState({ status: 'loading' });
      this.props.loginWithPhone({
        phone: this.state.phone,
        password: this.state.password,
      });
    }
  }

  _handleLoginWithWechat() {

  }

  _handleLoginWithWeibo() {

  }

  _renderLoginModal() {
    return (
      <div>
        {this._renderErrorMsg()}
        <FlatButton
          backgroundColor="#3BA435"
          hoverColor="#2C7727"
          disabled={this.state.status === 'loading'}
          onTouchTap={this._handleLoginWithWechat.bind(this)}
          style={{
            width: '100%',
            margin: '20px 0 10px 0',
            color: 'white',
          }}
        >{__('Login with Wechat')}</FlatButton>
        <FlatButton
          backgroundColor="#E47829"
          hoverColor="#B25D20"
          disabled={this.state.status === 'loading'}
          onTouchTap={this._handleLoginWithWeibo.bind(this)}
          style={{
            width: '100%',
            margin: '0',
            color: 'white',
          }}
        >{__('Login with Weibo')}</FlatButton>
        <p className="login-modal-content__separator">{__('OR')}</p>
        <Input
          ref="phoneInput"
          value={this.state.phone}
          className="login-modal-content__input"
          disabled={this.state.status === 'loading'}
          isRequired
          hintText={__('Phone Number')}
          onChange={this._updatePhone.bind(this)}
        />
        <Input
          ref="passwordInput"
          type="password"
          value={this.state.password}
          isRequired
          className="login-modal-content__input"
          disabled={this.state.status === 'loading'}
          hintText={__('Password')}
          onChange={this._updatePassword.bind(this)}
        />
        <div className="login-modal-content__remember">
          <button
            className="button-as-link login-modal-content__switch-btn
              login-modal-content__remember__forget"
            onClick={this.props.transitToForgetPassword}
          >{__('Forgot Password?')}</button>
        </div>
        {this._renderLoginButton()}
        <span className="login-modal-content__options">
          {__("Don't have an account?")}
          <button
            className="login-modal-content__switch-btn button-as-link"
            onClick={this.props.transitToSignup}
          >{__('Sign Up')}</button>
        </span>
      </div>
    );
  }

  render() {
    if (this.state.shouldCreateProfile) {
      return (
        <CreateProfileModal
          submitBtnMsg="Finish"
          onSuccess={this.props.onLoginSuccess}
        />
      );
    }
    return this._renderLoginModal();
  }
}

LoginModalContent.propTypes = {
  loginState: React.PropTypes.object,
  loginWithPhone: React.PropTypes.func,
  onLoginSuccess: React.PropTypes.func,
  transitToSignup: React.PropTypes.func,
  transitToForgetPassword: React.PropTypes.func,
};

export default LoginModalContent ;
