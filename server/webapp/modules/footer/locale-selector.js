import { connect } from 'react-redux'

import LocaleSelector from './locale-selector.component';
import { webRequestAction } from '../../actions/utils';
import { updateLocaleAction } from '../../actions/locale';

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    setLocale: (locale) => {
      dispatch(new webRequestAction({
        url: `/api/locale`,
        method: 'POST',
        body: { locale },
        nextAction: updateLocaleAction,
      }))
    }
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LocaleSelector)
