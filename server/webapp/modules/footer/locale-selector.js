import { connect } from 'react-redux'

import LocaleSelector from './locale-selector.component';

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    setLocale: (locale) => {

    }
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LocaleSelector)
