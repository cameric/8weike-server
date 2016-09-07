import { connect } from 'react-redux'

import { webRequestAction } from '../../../../actions/utils';
import { signupWithPhoneBasicInfoAction,
         signupWithPhoneTFAAction,
         signupWithPhoneUsernameAction,
         renderCaptchaInSignupAction } from '../../../../actions/auth';
import SignupModalContent from './signup-modal-content.component';

function mapStateToProps(state) {
  return {
    signupState: state.auth.signup,
    credentialId: state.auth.id,
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
    sendCredential: (basicInfo, captchaHash) => {
      dispatch(new webRequestAction({
        url: '/api/signup/phone/web',
        method: 'POST',
        body: {
          phone: basicInfo.phone,
          password: basicInfo.password,
          captcha: basicInfo.captcha,
          hash: captchaHash,
        },
        nextAction: signupWithPhoneBasicInfoAction,
      }))
    },
    verifyTFACode: (credential, code) => {
      console.log(credential);
      dispatch(new webRequestAction({
        url: '/api/signup/verify',
        method: 'POST',
        body: { credential, code },
        nextAction: signupWithPhoneTFAAction,
      }))
    },
    createProfile: (nickname) => {
      dispatch(new webRequestAction({
        url: '/api/profile/create',
        method: 'POST',
        body: { nickname },
        nextAction: signupWithPhoneUsernameAction,
      }))
    }
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupModalContent)
