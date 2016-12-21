/*
An in-memory cache
stored in "window"
under specified namespace

Required: React component must define
a "displayName"
*/

var env = require('./env')
var namespace = env.namespace

//initialize global namespace
if (!window[namespace]) window[namespace] = {}


module.exports = function (partialState, shouldOverwrite) {
	
	var displayName = this.constructor.displayName
	function genHash(key) {
		return displayName+ ':' +key+ ':' +window.location.pathname
	}				
	
	if (shouldOverwrite) {
		
		Object.keys(partialState).map((key) => {
			//force write cache
			window[namespace][genHash(key)] = partialState[key]
		})
	}
	
	if (!shouldOverwrite) {
		
		Object.keys(partialState).map((key) => {
			if (window[namespace][genHash(key)]) partialState[key] = window[namespace][genHash(key)]
			else window[namespace][genHash(key)] = partialState[key]
		})
	}

	return partialState
}