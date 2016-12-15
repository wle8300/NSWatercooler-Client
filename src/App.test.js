import React from 'react'
var ReactDOM = require('react-dom')
var App = require('./App')

it('renders without crashing', () => {
  var div = document.createElement('div')
  ReactDOM.render(<App />, div)
})
