import { connect } from 'react-redux';

import { webRequestAction } from '../../actions/utils';
import { logoutAction } from '../../actions/auth';
import { createProfileAction } from '../../actions/profile';
import CreateProfileModal from './create-profile-modal.component';

function mapStateToProps(state) {
  return {
    profile: state.profile.info,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createProfile: (nickname) => {
      dispatch(webRequestAction({
        url: '/api/profile',
        method: 'POST',
        body: { nickname },
        nextAction: createProfileAction,
      }));
    },
    logoutIfNotSet: () => {
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
)(CreateProfileModal);
