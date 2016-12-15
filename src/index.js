var injectTapEventPlugin = require('react-tap-event-plugin')
injectTapEventPlugin();

import React from 'react'
var ReactDOM = require('react-dom')
var App = require('./App')

ReactDOM.render(
  <App />,
  document.getElementById('root')
)