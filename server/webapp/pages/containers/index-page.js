import { connect } from 'react-redux'

import IndexPage from '../components/index-page';

function mapStateToProps(state) {
  return {
    globalInfo: state.pageInitialState
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexPage)
