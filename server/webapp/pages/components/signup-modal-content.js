import React from 'react';
import Input from '../../ui/input';
import FlatButton from 'material-ui/FlatButton';
import validator from 'validator';

require('../../stylesheets/modules/signup-modal-content.scss');

class SignupModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'basicInfo'
    }
  }

  getNextStep(step) {
    this.setState({step: step})
  }

  renderBasicInfoStep() {
    return (
      <div>
        <Input classNames="signup-modal-content__input"
               hintText="Phone Number"/>
        <Input classNames="signup-modal-content__input" type="password" hintText="Password"/>
        <Input classNames="signup-modal-content__input" type="password" hintText="Confirm Password"/>
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
        <Input classNames="signup-modal-content__input" hintText="6-digit Passcode"/>
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
        <Input classNames="signup-modal-content__input" hintText="Nickname"/>
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
