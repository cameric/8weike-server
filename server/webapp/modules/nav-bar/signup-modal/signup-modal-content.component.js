import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import { white } from 'material-ui/styles/colors';
import validator from 'validator';

import CountDown from '../../../ui/countdown';
import CreateProfileModal from '../../profile/create-profile-modal';
import ErrorBanner from '../../../ui/error-banner';
import Input from '../../../ui/input';
import PasswordStrength from './password-strength';

require('../../../stylesheets/modules/nav-bar/user-auth/signup-modal-content.scss');

class SignupModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'credential',
      status: 'waiting',
      credential: {
        phone: '',
        password: '',
        confirmPassword: '',
        captcha: '',
      },
      tfaCode: '',
      nickname: '',
      shouldDisableTfaBtn: true,
    };

    this._phoneValidators = [
      {
        // TODO: Add functionality to add phone number other than China's
        validator: (phone) => validator.isMobilePhone(phone, 'zh-CN'),
        errorText: __('Not a valid phone number!'),
      },
    ];
    this._passwordValidators = [
      {
        validator: (password) => validator.isLength(password, { min: 8, max: undefined }),
        errorText: __('Password should be at least 8 characters!'),
      },
      // TODO: Find a better way to handle password requirement
      //{
      //  validator: (password) => !(validator.isNumeric(password) || validator.isAlpha(password)),
      //  errorText: 'Password must contain both letters and digits!',
      //}
    ];
    this._confirmPasswordValidators = [
      {
        validator: (confirmPassword) => confirmPassword === this.state.credential.password,
        errorText: __('Passwords do not match!'),
      },
    ];
    this._tfaValidators = [
      {
        validator: (tfaCode) => validator.isNumeric(tfaCode) &&
          validator.isLength(tfaCode, { min: 6, max: 6 }),
        errorText: 'Code length should be 6!',
      },
    ];
  }

  // Handle signup state updates

  componentWillMount() {
    this.props.generateCaptcha();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.status === 'loading' &&
        nextProps.signupState !== this.props.signupState) {
      if (nextProps.signupState.status === 'error') {
        // Reset user input if error
        this.setState({ status: 'waiting' });
        // Regenerate a new captcha if anything fails
        this.props.generateCaptcha();
      } else if (nextProps.signupState.status === 'success') {
        // Proceed to next step
        this.setState({
          status: 'waiting',
          step: nextProps.signupState.nextStep,
        });
      }
    }
  }

  // Helpers for conditional rendering

  _renderErrorMsg() {
    if (this.props.signupState && this.props.signupState.status === 'error') {
      return (
        <ErrorBanner errorMsg={this.props.signupState.error.message} />
      );
    }
    return null;
  }

  _renderCaptcha() {
    if (this.props.signupState && this.props.signupState.captcha) {
      if (this.props.signupState.captcha.picture) {
        return (
          <div>
            <Input
              ref="captchaInput"
              value={this.state.credential.captcha}
              isRequired={true}
              className="signup-modal-content__captcha-input"
              disabled={this.state.status === 'loading'}
              hintText={__('Captcha Numbers')}
              onChange={this._updateCaptcha.bind(this)}
            />
            <button
              className="button-as-link signup-modal-content__captcha-button"
              onClick={this.props.generateCaptcha}
            >
              <img
                alt={__('Captcha text')}
                src={`data:image/png;base64,${this.props.signupState.captcha.picture}`}
              />
            </button>
          </div>
        );
      }

      return (
        <div>{__('Unable to load Captcha!')}</div>
      );
    }
    return null;
  }

  _renderTFAResendBtnContent() {
    if (this.state.shouldDisableTfaBtn) {
      return (
        <span>
          Enable resend in <CountDown
            duration={30}
            onFinished={() => {
              this.setState({ shouldDisableTfaBtn: false });
            }}
          /> seconds
        </span>
      );
    }
    return (<span>Resend code now</span>);
  }

  _renderNextStepButton(info, handleTouchTap) {
    const buttonMsg = (this.state.status === 'waiting') ? info
        : (<CircularProgress color={white} size={0.3} style={{ marginTop: '-7px' }} />);
    return (
      <FlatButton
        backgroundColor="#00BCD4"
        hoverColor="#0CB6C9"
        disabled={this.state.status === 'loading'}
        onTouchTap={handleTouchTap}
        style={{
          width: '100%',
          margin: '20px 0 20px 0',
          color: 'white',
        }}
      >{buttonMsg}</FlatButton>
    );
  }

  // Helpers for the basic info step

  _updatePartialState(partialState, newInfo) {
    this.setState({
      [partialState]: Object.assign({}, this.state[partialState], newInfo),
    });
  }

  _updatePhone(phone) {
    this._updatePartialState('credential', { phone });
  }

  _updatePassword(password) {
    this._updatePartialState('credential', { password });
  }

  _updateConfirmPassword(confirmPassword) {
    this._updatePartialState('credential', { confirmPassword });
  }

  _updateCaptcha(captcha) {
    this._updatePartialState('credential', { captcha });
  }

  // Helpers for TFA step

  _updateTFACode(tfaCode) {
    this.setState({ tfaCode });
  }

  _handleTFAResend() {
    this.setState({ shouldDisableTfaBtn: true });
    this.props.resendTFACode();
  }

  // Action handlers

  _submitCredential() {
    const isPhoneValid = this.refs.phoneInput.validate();
    const isPasswordValid = this.refs.passwordInput.validate();
    const isConfirmPasswordValid = this.refs.confirmPasswordInput.validate();
    const isCaptchaValid = this.refs.captchaInput.validate();
    if (isPhoneValid && isPasswordValid && isConfirmPasswordValid && isCaptchaValid) {
      this.setState({ status: 'loading' });
      this.props.sendCredential(this.state.credential,
                               this.props.signupState.captcha.hash);
    }
  }

  _submitTFACode() {
    this.setState({ status: 'loading' });
    this.props.verifyTFACode({
      id: this.props.credentialId,
      phone: this.state.credential.phone,
      password: this.state.credential.password,
    }, this.state.tfaCode);
  }

  renderCredentialStep() {
    return (
      <div>
        {this._renderErrorMsg()}
        <Input
          ref="phoneInput"
          value={this.state.credential.phone}
          className="signup-modal-content__input"
          disabled={this.state.status === 'loading'}
          isRequired
          hintText={__('Phone Number')}
          validators={this._phoneValidators}
          onChange={this._updatePhone.bind(this)}
        />
        <div className="signup-modal-content__password-container">
          <PasswordStrength
            classNames="signup-modal-content__password-strength"
            password={this.state.credential.password}
          />
          <Input
            ref="passwordInput"
            type="password"
            value={this.state.credential.password}
            isRequired
            className="signup-modal-content__input"
            disabled={this.state.status === 'loading'}
            hintText={__('Password')}
            validators={this._passwordValidators}
            onChange={this._updatePassword.bind(this)}
          />
        </div>
        <Input
          ref="confirmPasswordInput"
          type="password"
          value={this.state.credential.confirmPassword}
          isRequired
          className="signup-modal-content__input"
          disabled={this.state.status === 'loading'}
          hintText={__('Confirm Password')}
          validators={this._confirmPasswordValidators}
          onChange={this._updateConfirmPassword.bind(this)}
        />
        {this._renderCaptcha()}
        {this._renderNextStepButton(__('Sign Up'), this._submitCredential.bind(this))}
        <span className="signup-modal-content__options">
          {__('Already a member?')}
          <button
            className="signup-modal-content__switch-btn button-as-link"
            onClick={this.props.transitToLogin}
          >{__('Login')}</button>
        </span>
      </div>
    );
  }

  renderTFAStep() {
    return (
      <div>
        {this._renderErrorMsg()}
        <span
          style={{
            display: 'block',
            marginTop: '30px',
          }}
        >
          {__('A passcode has been sent to your phone')}
          <button
            className="button-as-link signup-modal-content__tfa-resend-btn"
            disabled={this.state.shouldDisableTfaBtn}
            onClick={this._handleTFAResend.bind(this)}
          >
            {this._renderTFAResendBtnContent()}
          </button>
        </span>
        <Input
          value={this.state.tfaCode}
          className="signup-modal-content__input"
          isRequired
          hintText={__('6-digit Passcode')}
          validators={this._tfaValidators}
          onChange={this._updateTFACode.bind(this)}
        />
        {this._renderNextStepButton(__('Confirm Phone Number'), this._submitTFACode.bind(this))}
      </div>
    );
  }

  render() {
    switch (this.state.step) {
      case 'credential':
        return this.renderCredentialStep();
      case 'tfa':
        return this.renderTFAStep();
      case 'profile':
        return (
          <CreateProfileModal
            submitBtnMsg={__('Finish')}
            onSuccess={this.props.onSignupSuccess.bind(this)}
          />);
      default:
        return (
          <span
            style={{
              display: 'block',
              marginTop: '30px',
            }}
          >Done</span>);
    }
  }
}

SignupModalContent.propTypes = {
  credentialId: React.PropTypes.string,
  signupState: React.PropTypes.object,
  transitToLogin: React.PropTypes.func,
  onSignupSuccess: React.PropTypes.func,

  // Container-provided props
  generateCaptcha: React.PropTypes.func,
  resendTFACode: React.PropTypes.func,
  verifyCaptcha: React.PropTypes.func,
  sendCredential: React.PropTypes.func,
  verifyTFACode: React.PropTypes.func,
};

export default SignupModalContent;
