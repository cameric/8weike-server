import { connect } from 'react-redux'

import UserAuth from './user-auth.component';
import { webRequestAction } from '../../../actions/utils';
import { loadUserByIdAction } from '../../../actions/profile';

function mapStateToProps(state) {
  return {
    profileId: state.profile.id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadUserById: (uid) => {
      //dispatch(new webRequestAction({
      //  url: `/api/user/${uid}`,
      //  method: 'GET',
      //  nextAction: loadUserByIdAction,
      //}))
    }
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAuth)
