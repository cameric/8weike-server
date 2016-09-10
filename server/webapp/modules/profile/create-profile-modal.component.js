import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import { white } from 'material-ui/styles/colors';
import validator from 'validator';

import Input from '../../ui/input';

class CreateProfileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'waiting',
      nickname: '',
      completed: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile && nextProps.profile !== this.props.profile) {
      this.setState({ completed: true }, this.props.onSuccess.bind(this));
    }
  }

  componentWillUnmount() {
    if (!this.state.completed && !this.props.profile) {
      // Logout if the user does not complete the task
      //this.props.logoutIfNotSet();
      console.log("hit");
    }
  }

  _updateNickname(nickname) {
    this.setState({ nickname });
  }

  _submitProfile() {
    this.setState({ status: 'loading' });
    this.props.createProfile(this.state.nickname);
  }

  _renderSubmitButton() {
    const buttonMsg = (this.state.status === 'waiting') ? this.props.submitBtnMsg
        : (<CircularProgress color={white} size={0.3} style={{ marginTop: '-7px' }}/>);
    return (
        <FlatButton backgroundColor='#00BCD4'
                    hoverColor='#0CB6C9'
                    disabled={this.state.status === 'loading'}
                    onTouchTap={this._submitProfile.bind(this)}
                    style={ {
                    width: '100%',
                    margin: '20px 0 0 0',
                    color: 'white',
                  } }>{buttonMsg}</FlatButton>
    )
  }

  render() {
    return (
        <div>
          <Input value={this.state.nickname}
                 className='signup-modal-content__input'
                 isRequired={true}
                 hintText='Nickname'
                 onChange={this._updateNickname.bind(this)}/>
          {this._renderSubmitButton()}
        </div>
    )
  }
}

CreateProfileModal.propTypes = {
  submitBtnMsg: React.PropTypes.string,
  onSuccess: React.PropTypes.func,

  createProfile: React.PropTypes.func,
  logoutIfNotSet: React.PropTypes.func,
};

export default CreateProfileModal;
