import { connect } from 'react-redux'

import IndexPage from './index-page.component';
import { webRequestAction } from '../../actions/utils';
import { loadUserByIdAction } from '../../actions/profile';

function mapStateToProps(state) {
  return {
    globalInfo: state.pageInitialState,
    user: state.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadUserById: (uid) => {
      dispatch(new webRequestAction({
        url: `/api/user/${uid}`,
        method: 'GET',
        nextAction: loadUserByIdAction,
      }))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexPage)
