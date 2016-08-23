// The index page

import React from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';

import { webRequestAction, constructInitialStatePayload } from '../../actions/utils';
import Modal from '../../ui/modal';
import SignupModalContent from './signup-modal-content';

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
          <Modal targetButton={<button>Sign Up</button>} title="Sign Up">
            <SignupModalContent />
          </Modal>
        </div>
      </DocumentTitle>
    )
  }
}

IndexPage.propTypes = {
  globalInfo: React.PropTypes.object
};

export default IndexPage