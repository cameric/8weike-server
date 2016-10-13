import { connect } from 'react-redux';

import { webRequestAction } from '../../../actions/utils';
import { loginWithPhoneAction } from '../../../actions/auth';
import LoginModalContent from './login-modal-content.component';

function mapStateToProps(state) {
  return {
    loginState: state.auth.login,
    hasProfile: state.auth.hasProfile,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginWithPhone: (info) => {
      dispatch(webRequestAction({
        url: '/api/login/phone',
        method: 'POST',
        body: {
          phone: info.phone,
          password: info.password,
        },
        nextAction: loginWithPhoneAction,
      }));
    },
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginModalContent);
