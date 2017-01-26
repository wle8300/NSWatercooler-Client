module.exports = {
	//NODE_ENV is implicitly defined via react-scripts@npm
	backend: process.env.NODE_ENV === 'production' ? 'https://member.club' : 'http://localhost:3001',
	namespace: 'DAKKACLUB',
	supportEmail: 'williamle8300@gmail.com'
}