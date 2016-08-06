'use strict';

// This is the entry point for React webapp

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'

import routes from './shared/routes'

// After initial server-side rendering, ReactDOM.render()
// will be called to update the state and event handlers.
const appContainer = document.getElementById('8weike-app-container');
ReactDOM.render(
    <Router routes={routes} history={browserHistory}/>,
    appContainer
);
