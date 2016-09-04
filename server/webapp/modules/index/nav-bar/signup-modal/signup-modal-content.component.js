import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import { white } from 'material-ui/styles/colors';
import validator from 'validator';

import ErrorBanner from '../../../../ui/error-banner';
import Input from '../../../../ui/input';
import PasswordStrength from './password-strength';

require('../../../../stylesheets/modules/signup-modal-content.scss');
require('../../../../stylesheets/utils/button.scss');

class SignupModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'basicInfo',
      status: 'waiting',
      basicInfo: {
        phone: '',
        password: '',
        confirmPassword: '',
      },
      tfaCode: '',
      username: '',
    };

    this._phoneValidators = [
      {
        validator: (phone) => validator.isMobilePhone(phone, global.LOCALE),
        errorText: 'Not a valid phone number!',
      }
    ];
    this._passwordValidators = [
      {
        validator: (password) => validator.isLength(password, {min: 8, max: undefined}),
        errorText: 'Password should be at least 8 characters!',
      },
      // TODO: Find a better way to handle password requirement
      //{
      //  validator: (password) => !(validator.isNumeric(password) || validator.isAlpha(password)),
      //  errorText: 'Password must contain both letters and digits!',
      //}
    ];
    this._confirmPasswordValidators = [
      {
        validator: (confirmPassword) => confirmPassword === this.state.basicInfo.password,
        errorText: 'Passwords do not match!',
      }
    ];
    this._tfaValidators = [
      {
        validator: (tfaCode) => validator.isNumeric(tfaCode) &&
          validator.isLength(tfaCode, {min: 6, max: 6}),
        errorText: 'Code should contain 6 digits!',
      }
    ];
  }

  // Handle signup state updates

  componentWillReceiveProps(nextProps) {
    if (this.state.status === 'loading' &&
        nextProps.signupState != this.props.signupState) {
      if (nextProps.signupState.status === 'error') {
        // Reset user input if error
        this.setState({ status: 'waiting' });
      } else if (nextProps.signupState.status === 'success') {
        // Proceed to next step
        this.setState({
          status: 'waiting',
          step: nextProps.signupState.nextStep
        });
      }
    }
  }

  // Helpers for conditional rendering

  _renderErrorMsg() {
    if (this.props.signupState && this.props.signupState.status === 'error') {
      return (
        <ErrorBanner errorMsg={this.props.signupState.error.message}/>
      );
    } else {
      return null;
    }
  }

  _renderNextStepButton(info, handleTouchTap) {
    const buttonMsg = (this.state.status === 'waiting') ? info
        : (<CircularProgress color={white} size={0.3} style={{ marginTop: '-7px' }}/>);
    return (
      <FlatButton backgroundColor='#00BCD4'
                  hoverColor='#0CB6C9'
                  disabled={this.state.status === 'loading'}
                  onTouchTap={handleTouchTap}
                  style={ {
                    width: '100%',
                    margin: '20px 0 20px 0',
                    color: 'white',
                  } }>{buttonMsg}</FlatButton>
    )
  }

  // Helpers for the basic info step

  _updatePartialState(partialState, newInfo) {
    this.setState({
      [partialState]: Object.assign({}, this.state[partialState], newInfo),
    });
  }

  _updatePhone(phone) {
    this._updatePartialState('basicInfo', { phone });
  }

  _updatePassword(password) {
    this._updatePartialState('basicInfo', { password });
  }

  _updateConfirmPassword(confirmPassword) {
    this._updatePartialState('basicInfo', { confirmPassword });
  }

  // Helpers for TFA step

  _updateTFACode(tfaCode) {
    this._updatePartialState('tfaCode', tfaCode);
  }

  _updateUsername(username) {
    this._updatePartialState('username', username);
  }

  // Action handlers

  _submitBasicInfo() {
    const isPhoneValid = this.refs.phoneInput.validate();
    const isPasswordValid = this.refs.passwordInput.validate();
    const isConfirmPasswordValid = this.refs.confirmPasswordInput.validate();
    if (isPhoneValid && isPasswordValid && isConfirmPasswordValid) {
      this.setState({ status: 'loading' });
      this.props.sendBasicInfo(this.state.basicInfo);
    }
  }

  _submitTFACode() {
    this.setState({ status: 'loading'});
    this.props.verifyTFACode(this.state.uid, this.state.tfaCode);
  }

  _submitUsername() {
    this.setState({ status: 'loading'});
    this.props.sendUsernameInfo(this.state.username);
  }

  renderBasicInfoStep() {
    return (
      <div>
        {this._renderErrorMsg()}
        <Input ref="phoneInput"
               value={this.state.basicInfo.phone}
               className='signup-modal-content__input'
               disabled={this.state.status === 'loading'}
               isRequired={true}
               hintText='Phone Number'
               validators={this._phoneValidators}
               onChange={this._updatePhone.bind(this)}/>
        <div className='signup-modal-content__password-container'>
          <PasswordStrength classNames='signup-modal-content__password-strength'
                            password={this.state.basicInfo.password}/>
          <Input ref="passwordInput"
                 type='password'
                 value={this.state.basicInfo.password}
                 isRequired={true}
                 className='signup-modal-content__input'
                 disabled={this.state.status === 'loading'}
                 hintText='Password'
                 validators={this._passwordValidators}
                 onChange={this._updatePassword.bind(this)}/>
        </div>
        <Input ref="confirmPasswordInput"
               type="password"
               value={this.state.basicInfo.confirmPassword}
               isRequired={true}
               className='signup-modal-content__input'
               disabled={this.state.status === 'loading'}
               hintText='Confirm Password'
               validators={this._confirmPasswordValidators}
               onChange={this._updateConfirmPassword.bind(this)}/>
        {this._renderNextStepButton('Sign Up', this._submitBasicInfo.bind(this))}
        <span className="signup-modal-content__options">
          Already a member?
          <button className='signup-modal-content__switch-btn button-as-link'
                  onClick={this.props.transitToLogin}>Login</button>
        </span>
      </div>
    )
  }

  renderTFAStep() {
    return (
      <div>
        <span style={ {
          display: 'block',
          marginTop: '30px',
        } }>A passcode has been sent to your phone</span>
        <Input value={this.state.tfaCode}
               className='signup-modal-content__input'
               isRequired={true}
               hintText='6-digit Passcode'
               validators={this._tfaValidators}
               onChange={this._updateTFACode.bind(this)}/>
        {this._renderNextStepButton('Confirm Phone Number', this._submitTFACode.bind(this))}
      </div>
    )
  }

  renderUsernameStep() {
    return (
      <div>
        <Input value={this.state.username}
               className='signup-modal-content__input'
               isRequired={true}
               hintText='Nickname'
               onChange={this._updateUsername.bind(this)}/>
        {this._renderNextStepButton('Finish', this._submitUsername.bind(this))}
      </div>
    )
  }

  render() {
    switch (this.state.step) {
      case 'basicInfo':
        return this.renderBasicInfoStep();
      case 'tfa':
        return this.renderTFAStep();
      case 'username':
        return this.renderUsernameStep();
      default:
        return (<span style={ {
          display: 'block',
          marginTop: '30px',
        } }>Done</span>);
    }
  }
}

SignupModalContent.propTypes = {
  signupState: React.PropTypes.object,
  transitToLogin: React.PropTypes.func,
  sendBasicInfo: React.PropTypes.func,
  sendTFACode: React.PropTypes.func,
  verifyTFACode: React.PropTypes.func,
  sendUsernameInfo: React.PropTypes.func,
};

export default SignupModalContent;
