module.exports = {
	//NODE_ENV is implicitly defined via react-scripts@npm
	backend: process.env.NODE_ENV === 'production' ? 'http://api.nswatercooler.com' : 'http://localhost:3000',
	namespace: 'NSWatercooler',
	supportEmail: 'williamle8300@gmail.com'
}