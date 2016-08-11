// This file defines all client routes

import React from 'react';
import {Route, IndexRoute} from 'react-router';
import DocumentTitle from 'react-document-title';
import IndexPage from '../pages/index_page';
import LoginPage from '../pages/login_page';

// App component is a top-level virtual container that
// doesn't belong to any page.
class App extends React.Component {
  render() {
    return (
        < DocumentTitle
    title = "8WeiKe" >
        {this.props.children
  }
  </
    DocumentTitle >
  )
  }
}

export default (
< Route
path = "/"
component = {App} >
    < IndexRoute
component = {IndexPage} / >
    < Route
path = "login"
component = {LoginPage} / >
    < / Route >
)
;
