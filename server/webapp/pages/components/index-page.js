// The index page

import React from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';

class IndexPage extends React.Component {
  render() {
    return (
      <DocumentTitle title="8WeiKe - Index">
        <div>
          This is the index page of 8weike website.
          <li><Link to={'/login'}>Login Here</Link></li>
          <button onClick={this.props.onSendRequest}>Send Request</button>
        </div>
      </DocumentTitle>
    )
  }
}

IndexPage.propTypes = {
  onSendRequest: React.PropTypes.func
};

export default IndexPage