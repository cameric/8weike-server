import { connect } from 'react-redux'

import IndexPage from '../components/index-page';
import { webRequestAction, stubAction } from '../../actions/utils';

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    onSendRequest: () => {
      dispatch(webRequestAction({
        method: 'POST',
        url: '/api/stub',
        body: {
          text: 'test'
        },
        nextAction: stubAction,
      }))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexPage)
