// login page

import React from 'react';
import DocumentTitle from 'react-document-title';

export default class LoginPage extends React.Component {
  render() {
    return (
      <DocumentTitle title="8WeiKe - Login">
        <div>This is the login page of 8weike website.</div>
        <span>电话 </span><input type="text" value={this.state.phone} />
        <span>密码 </span><input type="password" value={this.state.password} />
        <button onClick={this.props.handleSendTFACode}>登陆</button>
      </DocumentTitle>
    )
  }
}

