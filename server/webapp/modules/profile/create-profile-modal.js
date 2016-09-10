import { connect } from 'react-redux'

import { webRequestAction } from '../../actions/utils';
import { logoutAction } from '../../actions/auth';
import { createProfileAction } from '../../actions/profile';
import CreateProfileModal from './create-profile-modal.component';

function mapStateToProps(state) {
  return {
    profileId: state.auth.profileId,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createProfile: (nickname) => {
      dispatch(new webRequestAction({
        url: '/api/profile/create',
        method: 'POST',
        body: { nickname },
        nextAction: createProfileAction,
      }))
    },
    logoutIfNotSet: () => {
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
)(CreateProfileModal)

