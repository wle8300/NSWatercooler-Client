/*
An in-memory cache
stored in "window"
under specified namespace
*/

var env = require('./env')
var namespace = env.namespace

//initialize global namespace
if (!window[namespace]) window[namespace] = {}


module.exports = function (key, value, shouldOverwrite) {
		
	var lookup = this.constructor.displayName+ ':' +key+ ':' +window.location.pathname

	//who cares if a value exists!? overwrite and return!
	if (shouldOverwrite) return window[namespace][lookup] = value
	
	//use the existing value... otherwise return supplied value
	if (!shouldOverwrite) {
		
		if (!window[namespace][lookup]) return window[namespace][lookup] = value
		else return window[namespace][lookup]
	}
}