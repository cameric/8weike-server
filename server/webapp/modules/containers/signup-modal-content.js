import { connect } from 'react-redux'

import { webRequestAction } from '../../actions/utils';
import { signupWithPhoneBasicInfoAction,
         signupWithPhoneTFAAction,
         signupWithPhoneUsernameAction } from '../../actions/auth';
import SignupModalContent from '../components/signup-modal-content';

function mapStateToProps(state) {
  return {
    signupState: state.auth.signup
  }
}

function mapDispatchToProps(dispatch) {
  return {
    sendBasicInfo: (basicInfo) => {
      dispatch(new webRequestAction({
        url: '/api/signup/phone',
        method: 'POST',
        body: {
          phone: basicInfo.phone,
          password: basicInfo.password,
        },
        nextAction: signupWithPhoneBasicInfoAction,
      }))
    },
    sendTFACode: (code) => {
      dispatch(new webRequestAction({
        url: '/api/signup/tfa',
        method: 'POST',
        body: { code },
        nextAction: signupWithPhoneTFAAction,
      }))
    },
    sendUsernameInfo: (username) => {
      dispatch(new webRequestAction({
        url: '/api/signup/username',
        method: 'POST',
        body: { username },
        nextAction: signupWithPhoneUsernameAction,
      }))
    }
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupModalContent)
