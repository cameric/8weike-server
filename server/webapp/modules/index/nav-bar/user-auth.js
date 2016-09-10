import { connect } from 'react-redux'

import UserAuth from './user-auth.component';
import { webRequestAction } from '../../../actions/utils';
import { logoutAction } from '../../../actions/auth';
import { loadProfileByIdAction } from '../../../actions/profile';

function mapStateToProps(state) {
  return {
    uid: state.auth.uid,
    profile: state.profile.info,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadProfileById: () => {
      dispatch(new webRequestAction({
        url: `/api/profile/info`,
        method: 'GET',
        nextAction: loadProfileByIdAction,
      }))
    },
    logout: () => {
      dispatch(new webRequestAction({
        url: '/api/logout',
        method: 'GET',
        nextAction: logoutAction,
      }))
    }
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAuth)
