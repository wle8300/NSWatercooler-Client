/*
An in-memory cache
stored in "window"
under specified namespace
*/

var env = require('./env')
var namespace = env.namespace


module.exports = function (key, value, shouldOverwrite) {
	
	var lookup = key+ ':' +window.location.pathname

	//initialize global namespace
	if (!window[namespace]) return window[namespace] = {}
	
	//who cares if a value exists!? overwrite and return!
	if (shouldOverwrite) return window[namespace][lookup] = value
	
	//use the existing value... otherwise return supplied value
	if (!shouldOverwrite) {
		
		if (!window[namespace][lookup]) return window[namespace][lookup] = value
		else return window[namespace][lookup]
	}
}