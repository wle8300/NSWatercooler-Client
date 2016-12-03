var Main = require('./components/Main')
var Nav = require('./components/Nav')
var Footer = require('./components/Footer')

var env = require('../env')

var JwtDecode = require('jwt-decode')
var Request = require('superagent')
var React = require('react')


module.exports = React.createClass({
	getInitialState: function () {
		return {
			jwt: null,
			user: null
		}
	},
  render: function () {
    return (
			<div className="App" style={styleA()}>
				<Nav
					onJwt={this.onJwt}
					jwt={this.state.jwt}
					onUser={this.onUser}
					user={this.state.user}/>
				<Main
					jwt={this.state.jwt}
					user={this.state.user}
					onJwt={this.onJwt}
					onUser={this.onUser}/>
				<Footer/>

			</div>
    )
  },
	componentDidMount: function () {

		this.establishSession()
	},
	componentDidUpdate: function (prevProps, prevState) {
		
		//fresh jwt
		if (this.state.jwt && prevState.jwt !== this.state.jwt) {

			this.readUser()
		}
	},
	establishSession: function () {
		
		var expirationMs
		var expirationDate
		
		if (!JSON.parse(localStorage.jwt)) return
	
		//jwt spec unconventionally defines seconds, not milliseconds for expiration
		expirationMs = JwtDecode(JSON.parse(localStorage.jwt)).exp * 1000
		expirationDate = new Date(expirationMs)
		
		//exp passed?
		if (expirationDate < new Date()) {

			localStorage.removeItem('jwt')
			
			return this.onJwt(null)
		}
		
		//jwt is fresh. auto-renew it!
		else {
			
			Request
			.put(env.backend+ '/jwt')
			.send({jwt: JSON.parse(localStorage.jwt)})
			.end((err, response) => {

				if (err) throw err

				if (!response.text) return this.onJwt(null)

				return this.onJwt(response.text)
			})
		}
	},
	readUser: function () {

		Request
		.get(env.backend+ '/user/' +JwtDecode(this.state.jwt).id)
		.set({Authorization: 'Bearer ' +this.state.jwt})
		.end((err, response) => {
	
			if (err) throw err

			return this.onUser(response.body)
		})
	},
	onJwt: function (jwt, callback) {

		localStorage.jwt = JSON.stringify(jwt)
		
		return this.setState({jwt: jwt}, callback)
	},
	onUser: function (user, callback) {
		
		return this.setState({user: user}, callback)
	}
})

function styleA() {
	return {
		margin: '0 auto',
		width: '50%',
		fontFamily: 'Helvetica'
	}
}