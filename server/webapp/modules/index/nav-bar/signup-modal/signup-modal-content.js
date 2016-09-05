import { connect } from 'react-redux'

import { webRequestAction } from '../../../../actions/utils';
import { signupWithPhoneBasicInfoAction,
         signupWithPhoneTFAAction,
         signupWithPhoneUsernameAction,
         renderCaptchaInSignupAction,
         verifyCaptchaAction } from '../../../../actions/auth';
import SignupModalContent from './signup-modal-content.component';

function mapStateToProps(state) {
  return {
    signupState: state.auth.signup
  }
}

function mapDispatchToProps(dispatch) {
  return {
    generateCaptcha: () => {
      dispatch(new webRequestAction({
        url: '/api/captcha/get',
        method: 'POST',
        body: {
          width: 130,
          height: 35,
          offset: 20,
          fontsize: 25,
          quality: 80,
        },
        nextAction: renderCaptchaInSignupAction,
      }))
    },
    verifyCaptcha: (captcha, hash) => {
      dispatch(new webRequestAction({
        url: '/api/captcha/verify',
        method: 'POST',
        body: {
          captcha,
          hash,
        },
        nextAction: verifyCaptchaAction,
      }))
    },
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
