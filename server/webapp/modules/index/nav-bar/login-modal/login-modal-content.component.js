import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import { white, grey100 } from 'material-ui/styles/colors';

import ErrorBanner from '../../../../ui/error-banner';
import Input from '../../../../ui/input';

require('../../../../stylesheets/modules/login-modal-content.scss');
require('../../../../stylesheets/utils/button.scss');

class LoginModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      password: '',
      shouldRememberPassword: false,
      status: 'waiting',
    };
  }

  // Handle login state updates

  componentWillReceiveProps(nextProps) {
    if (this.state.status === 'loading' &&
        nextProps.loginState != this.props.loginState) {
      if (nextProps.loginState.status === 'error') {
        // Reset user input if error
        this.setState({ status: 'waiting' });
      } else if (nextProps.loginState.status === 'success') {
        this.props.onLoginSuccess();
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
          <ErrorBanner errorMsg={this.props.loginState.error.message}/>
      );
    } else {
      return null;
    }
  }

  _renderLoginButton() {
    const buttonMsg = (this.state.status === 'waiting') ? 'Login'
        : (<CircularProgress color={white} size={0.3} style={{ marginTop: '-7px' }}/>);
    return (
        <FlatButton backgroundColor='#00BCD4'
                    hoverColor='#0CB6C9'
                    disabled={this.state.status === 'loading'}
                    onTouchTap={this._handleLoginWithPhone.bind(this)}
                    style={ {
                    width: '100%',
                    margin: '20px 0 20px 0',
                    color: white,
                  } }>{buttonMsg}</FlatButton>
    )
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

  render() {
    return (
      <div>
        {this._renderErrorMsg()}
        <FlatButton backgroundColor='#3BA435'
                    hoverColor='#2C7727'
                    disabled={this.state.status === 'loading'}
                    onTouchTap={this._handleLoginWithWechat.bind(this)}
                    style={ {
                    width: '100%',
                    margin: '20px 0 10px 0',
                    color: 'white',
                  } }>Login with Wechat</FlatButton>
        <FlatButton backgroundColor='#E47829'
                    hoverColor='#B25D20'
                    disabled={this.state.status === 'loading'}
                    onTouchTap={this._handleLoginWithWeibo.bind(this)}
                    style={ {
                    width: '100%',
                    margin: '0',
                    color: 'white',
                  } }>Login with Weibo</FlatButton>
        <p className='login-modal-content__separator'>OR</p>
        <Input ref="phoneInput"
               value={this.state.phone}
               className='login-modal-content__input'
               disabled={this.state.status === 'loading'}
               isRequired={true}
               hintText='Phone Number'
               onChange={this._updatePhone.bind(this)}/>
        <Input ref="passwordInput"
               type='password'
               value={this.state.password}
               isRequired={true}
               className='login-modal-content__input'
               disabled={this.state.status === 'loading'}
               hintText='Password'
               onChange={this._updatePassword.bind(this)}/>
        <div className="login-modal-content__remember">
          <Checkbox checked={this.state.shouldRememberPassword}
                    disabled={this.state.status === 'loading'}
                    onCheck={this._updatePasswordRemember.bind(this)}
                    label="Remember me"
                    labelPosition='right'
                    style={{
                      width: '160px',
                      float: 'left',
                    }}/>
          <button className='button-as-link login-modal-content__switch-btn
                             login-modal-content__remember__forget'
                  onClick={this.props.transitToForgetPassword}>Forgot Password?</button>
        </div>
        {this._renderLoginButton()}
        <span className="login-modal-content__options">
          Don't have an account?
          <button className='login-modal-content__switch-btn button-as-link'
                  onClick={this.props.transitToSignup}>Sign Up</button>
        </span>
      </div>
    );
  }
}

LoginModalContent.propTypes = {
  loginState: React.PropTypes.object,
  loginWithPhone: React.PropTypes.func,
  onLoginSuccess: React.PropTypes.func,
  transitToSignup: React.PropTypes.func,
  transitToForgetPassword: React.PropTypes.func,
};

export default LoginModalContent
