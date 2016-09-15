// The index page

import React from 'react';
import DocumentTitle from 'react-document-title';

import NavBar from './nav-bar/nav-bar';
import Footer from '../footer/footer';
import { webRequestAction, constructInitialStatePayload } from '../../actions/utils';

require('../../stylesheets/modules/index-page.scss');

class IndexPage extends React.Component {
  static fetchData({ store }) {
    return store.dispatch(webRequestAction(constructInitialStatePayload({
      method: 'GET',
      url: '/api/global_info',
    })))
  }

  componentWillMount() {
    this.props.loadLoginStatus();
  }

  render() {
    return (
      <DocumentTitle title="8WeiKe - Index">
        <div>
          <NavBar />
          <span>Version: {this.props.globalInfo.version}</span>
          <span>Company: {this.props.globalInfo.company}</span>
          <Footer />
        </div>
      </DocumentTitle>
    )
  }
}

IndexPage.propTypes = {
  globalInfo: React.PropTypes.object,
  loadLoginStatus: React.PropTypes.func,
};

export default IndexPage