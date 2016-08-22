// The index page

import React from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';

import { webRequestAction, constructInitialStatePayload } from '../../actions/utils';

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
          This is the index page of 8weike website.
          <li><Link to={'/login'}>Login Here</Link></li>
          <span>Version: {this.props.globalInfo.version}</span>
          <span>Company: {this.props.globalInfo.company}</span>
        </div>
      </DocumentTitle>
    )
  }
}

IndexPage.propTypes = {
  globalInfo: React.PropTypes.object
};

export default IndexPage