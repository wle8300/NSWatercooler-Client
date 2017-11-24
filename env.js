module.exports = {
	//NODE_ENV is implicitly defined via react-scripts@npm
	backend: process.env.NODE_ENV === 'production' ? 'localhost:3003' : 'http://localhost:3003',
	namespace: 'DAKKACLUB',
	supportEmail: 'williamle8300@gmail.com'
}