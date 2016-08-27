// This file defines all client routes

import React from 'react';
import { Route, IndexRoute } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import DocumentTitle from 'react-document-title';
import IndexPage from '../modules/containers/index-page';
import LoginPage from '../modules/containers/login-page';

// App component is a top-level virtual container that
// doesn't belong to any page.
class App extends React.Component {
  render() {
    return (
      <DocumentTitle title="8WeiKe">
        <MuiThemeProvider>
          { this.props.children }
        </MuiThemeProvider>
      </DocumentTitle>
    )
  }
}

export default (
  <Route path="/" component={App}>
    <IndexRoute component={IndexPage}/>
    <Route path="login" component={LoginPage}/>
  </Route>
);
