import { connect } from 'react-redux'

import IndexPage from './index-page.component';
import { webRequestAction } from '../../actions/utils';
import { loadLoginStatusAction } from '../../actions/auth';

function mapStateToProps(state) {
  return {
    globalInfo: state.pageInitialState,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadLoginStatus: () => {
      dispatch(new webRequestAction({
        url: `/api/login`,
        method: 'GET',
        nextAction: loadLoginStatusAction,
      }))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexPage)
