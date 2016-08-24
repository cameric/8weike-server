import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import validator from 'validator';

import Input from '../../ui/input';
import PasswordStrength from './password-strength';

require('../../stylesheets/modules/signup-modal-content.scss');

class SignupModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'basicInfo',
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

  getNextStep(step) {
    this.setState({step: step})
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

  renderBasicInfoStep() {
    return (
      <div>
        <Input value={this.state.basicInfo.phone}
               className="signup-modal-content__input"
               isRequired={true}
               hintText="Phone Number"
               validators={this._phoneValidators}
               onChange={this._updatePhone.bind(this)}/>
        <div className="signup-modal-content__password-container">
          <PasswordStrength classNames='signup-modal-content__password-strength'
                            password={this.state.basicInfo.password}/>
          <Input type="password"
                 value={this.state.basicInfo.password}
                 isRequired={true}
                 className="signup-modal-content__input"
                 hintText="Password"
                 validators={this._passwordValidators}
                 onChange={this._updatePassword.bind(this)}/>
        </div>
        <Input type="password"
               value={this.state.basicInfo.confirmPassword}
               isRequired={true}
               className="signup-modal-content__input"
               hintText="Confirm Password"
               validators={this._confirmPasswordValidators}
               onChange={this._updateConfirmPassword.bind(this)}/>
        <FlatButton backgroundColor="#00BCD4"
                    hoverColor="#0CB6C9"
                    onClick={this.getNextStep.bind(this, 'TFA')}
                    style={ {
                      width: '100%',
                      margin: '20px 0 20px 0',
                      color: 'white',
                    } }>Sign Up</FlatButton>
        <span>Already a member? <a className="signup-modal-content__switch-btn">Sign in</a></span>
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
        <Input className="signup-modal-content__input" hintText="6-digit Passcode"/>
        <FlatButton backgroundColor="#00BCD4"
                    hoverColor="#0CB6C9"
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
        <Input className="signup-modal-content__input" hintText="Nickname"/>
        <FlatButton backgroundColor="#00BCD4"
                    hoverColor="#0CB6C9"
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

export default SignupModalContent;
