var https = process.env.HTTPS || false
var keyPath = https ? process.env.KEYPATH : null
var certPath = https ? process.env.CERTPATH : null
var address = process.env.ADDRESS || '127.0.0.1'
var port = process.env.PORT || 3000
var root = process.env.ROOT || 'build'
var dirs = process.env.DIRS || ['static']
var server = require('pushstate-https-server').createServer({
	https: https,
	keyPath: keyPath,
	certPath: certPath,
	address: address,
	port: port,
	root: root,
	dirs: dirs
});

server.start(function () {
	console.log('Server started on ' +(https ? 'https://' : 'http://')+address+ ':' +port+ '...');
	console.log('Directories with static files: ', dirs);
})