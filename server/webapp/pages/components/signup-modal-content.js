import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import { white } from 'material-ui/styles/colors';
import validator from 'validator';

import ErrorBanner from '../../ui/error-banner';
import Input from '../../ui/input';
import PasswordStrength from './password-strength';

require('../../stylesheets/modules/signup-modal-content.scss');

class SignupModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'basicInfo',
      status: 'stale',
      basicInfo: {
        phone: '',
        password: '',
        confirmPassword: '',
      }
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
      {
        validator: (password) => !(validator.isNumeric(password) || validator.isAlpha(password)),
        errorText: 'Password must contain both letters and digits!',
      }
    ];
    this._confirmPasswordValidators = [
      {
        validator: (confirmPassword) => confirmPassword === this.state.basicInfo.password,
        errorText: 'Passwords do not match!',
      }
    ];
  }

  // General helpers

  getNextStep(step) {
    this.setState({step: step})
  }

  _renderNextStepButton(info, handleTouchTap) {
    const buttonMsg = (this.state.status === 'stale') ? info
        : (<CircularProgress color={white} size={0.3} style={{ marginTop: '-7px' }}/>);
    return (
      <FlatButton backgroundColor='#00BCD4'
                  hoverColor='#0CB6C9'
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
    this._updatePartialState('basicInfo', { phone: phone });
  }

  _updatePassword(password) {
    this._updatePartialState('basicInfo', { password: password });
  }

  _updateConfirmPassword(confirmPassword) {
    this._updatePartialState('basicInfo', { confirmPassword: confirmPassword });
  }

  // Action handlers

  _submitBasicInfo() {
    this.setState({ status: 'loading'});
    //this.props.sendBasicInfo(this.state.basicInfo);
    //this.getNextStep.bind(this, 'TFA')
  }

  renderBasicInfoStep() {
    return (
      <div>
        <ErrorBanner errorMsg="Cellphone already existed!"/>
        <Input value={this.state.basicInfo.phone}
               className='signup-modal-content__input'
               isRequired={true}
               hintText='Phone Number'
               validators={this._phoneValidators}
               onChange={this._updatePhone.bind(this)}/>
        <div className='signup-modal-content__password-container'>
          <PasswordStrength classNames='signup-modal-content__password-strength'
                            password={this.state.basicInfo.password}/>
          <Input type='password'
                 value={this.state.basicInfo.password}
                 isRequired={true}
                 className='signup-modal-content__input'
                 hintText='Password'
                 validators={this._passwordValidators}
                 onChange={this._updatePassword.bind(this)}/>
        </div>
        <Input type="password"
               value={this.state.basicInfo.confirmPassword}
               isRequired={true}
               className='signup-modal-content__input'
               hintText='Confirm Password'
               validators={this._confirmPasswordValidators}
               onChange={this._updateConfirmPassword.bind(this)}/>
        {this._renderNextStepButton('Sign Up', this._submitBasicInfo.bind(this))}
        <span>Already a member? <a className='signup-modal-content__switch-btn'>Sign in</a></span>
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
        <Input className='signup-modal-content__input' hintText='6-digit Passcode'/>
        <FlatButton backgroundColor='#00BCD4'
                    hoverColor='#0CB6C9'
                    onClick={this.getNextStep.bind(this, 'username')}
                    style={ {
                  width: '100%',
                  margin: '20px 0 0 0',
                  color: 'white',
                } }>Confirm Phone Number</FlatButton>
      </div>
    )
  }

  renderUsernameStep() {
    return (
      <div>
        <Input className='signup-modal-content__input' hintText='Nickname'/>
        <FlatButton backgroundColor='#00BCD4'
                    hoverColor='#0CB6C9'
                    onClick={this.getNextStep.bind(this, 'finished')}
                    style={ {
                  width: '100%',
                  margin: '20px 0 0 0',
                  color: 'white',
                } }>Finish</FlatButton>
      </div>
    )
  }

  render() {
    switch (this.state.step) {
      case 'basicInfo':
        return this.renderBasicInfoStep();
      case 'TFA':
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
  sendBasicInfo: React.PropTypes.func,
  sendTFACode: React.PropTypes.func,
  sendUsernameInfo: React.PropTypes.func,
};

export default SignupModalContent;
