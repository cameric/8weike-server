// The index page

import React from 'react';
import DocumentTitle from 'react-document-title';

import NavBar from './nav-bar/nav-bar';
import { webRequestAction, constructInitialStatePayload } from '../../actions/utils';

require('../../stylesheets/modules/index-page.scss');

class IndexPage extends React.Component {
  static fetchData({ store }) {
    return store.dispatch(webRequestAction(constructInitialStatePayload({
      method: 'GET',
      url: '/api/global_info',
    })))
  }

  render() {
    return (
      <DocumentTitle title="8WeiKe - Index">
        <div>
          <NavBar />
          <span>Version: {this.props.globalInfo.version}</span>
          <span>Company: {this.props.globalInfo.company}</span>
        </div>
      </DocumentTitle>
    )
  }
}

IndexPage.propTypes = {
  globalInfo: React.PropTypes.object,
  loadUserById: React.PropTypes.func,
};

export default IndexPage