import { connect } from 'react-redux';

import UserAuth from './user-auth.component';
import { webRequestAction } from '../../actions/utils';
import { logoutAction } from '../../actions/auth';
import { loadProfileByIdAction } from '../../actions/profile';

function mapStateToProps(state) {
  return {
    uid: state.auth.uid,
    hasProfile: state.auth.hasProfile,
    loginState: state.auth.login,
    signupState: state.auth.signup,
    profile: state.profile.info,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadProfileById: () => {
      dispatch(webRequestAction({
        url: '/api/profiles/me',
        method: 'GET',
        nextAction: loadProfileByIdAction,
      }));
    },
    logout: () => {
      dispatch(webRequestAction({
        url: '/api/logout',
        method: 'GET',
        nextAction: logoutAction,
      }));
    },
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAuth);
