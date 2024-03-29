import { connect } from 'react-redux';

import { webRequestAction } from '../../../actions/utils';
import { signupWithPhoneCredentialAction,
         signupWithPhoneTFAAction,
         renderCaptchaInSignupAction } from '../../../actions/auth';
import SignupModalContent from './signup-modal-content.component';

function mapStateToProps(state) {
  return {
    locale: (typeof state.locale === 'string') ? state.locale : 'zh-CN',
    signupState: state.auth.signup,
    credentialId: state.auth.id,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    generateCaptcha: () => {
      dispatch(webRequestAction({
        url: '/api/captcha',
        method: 'POST',
        body: {
          width: 130,
          height: 35,
          offset: 20,
          fontsize: 25,
          quality: 80,
        },
        nextAction: renderCaptchaInSignupAction,
      }));
    },
    sendCredential: (credential, captchaHash) => {
      dispatch(webRequestAction({
        url: '/api/signup/phone/web',
        method: 'POST',
        body: {
          phone: credential.phone,
          password: credential.password,
          captcha: credential.captcha,
          hash: captchaHash,
        },
        nextAction: signupWithPhoneCredentialAction,
      }));
    },
    resendTFACode: () => {
      dispatch(webRequestAction({
        url: '/api/signup/resend_code',
        method: 'POST',
      }));
    },
    verifyTFACode: (credential, code) => {
      dispatch(webRequestAction({
        url: '/api/signup/verify',
        method: 'POST',
        body: { credential, code },
        nextAction: signupWithPhoneTFAAction,
      }));
    },
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupModalContent);
