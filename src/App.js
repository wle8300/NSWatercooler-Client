import Main from './components/Main'
import Header from './components/Header'
import Footer from './components/Footer'

import env from '../env'

import JwtDecode from 'jwt-decode'
import Request from 'superagent'
import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'


module.exports = React.createClass({
	getInitialState: function () {
		return {
			routerRef: null,
			jwt: null,
			user: null,
			marquee: {
				message: 'Home',
				size: 'normal'
			},
		}
	},
  render: function () {
    return (
			<MuiThemeProvider>
				<div className="App" style={style1()}>
					<Header marquee={this.state.marquee}/>
					<Main
						gotRouterRef={this.gotRouterRef}
						jwt={this.state.jwt}
						user={this.state.user}
						onJwt={this.onJwt}
						onUser={this.onUser}
						changeMarquee={this.changeMarquee}/>
					<Footer routerRef={this.state.routerRef}/>
				</div>
			</MuiThemeProvider>
    )
  },
	componentDidMount: function () {

		// this.establishSession()
	},
	componentDidUpdate: function (prevProps, prevState) {
		
		//fresh jwt
		// if (this.state.jwt && prevState.jwt !== this.state.jwt) {
		//
		// 	this.readUser()
		// }
	},
	changeMarquee: function (message, size) {
		
		this.setState({marquee: {
			message: message,
			size: size
		}})
	},
	gotRouterRef: function (routerRef) {

		this.setState({routerRef: routerRef})
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

function style1() {
	return {
		margin: '0 auto',
		fontFamily: 'Helvetica'
	}
}