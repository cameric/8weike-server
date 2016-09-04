import { connect } from 'react-redux'

import { webRequestAction } from '../../../../actions/utils';
import { signupWithPhoneBasicInfoAction,
         signupWithPhoneTFAAction,
         signupWithPhoneUsernameAction } from '../../../../actions/auth';
import SignupModalContent from './signup-modal-content.component';

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
    sendTFACode: (uid) => {
      dispatch(new webRequestAction({
        url: '/api/tfa/send',
        method: 'POST',
        body: { uid },
      }))
    },
    verifyTFACode: (uid, code) => {
      dispatch(new webRequestAction({
        url: '/api/tfa/verify',
        method: 'POST',
        body: { uid, code },
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
