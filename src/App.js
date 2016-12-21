import env from '../env'
import utils from '../utils'

import Main from './components/Main'
import Header from './components/Header'
import Drawer from './components/Drawer'
import Footer from './components/Footer'

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
			isDrawerOpen: false
		}
	},
  render: function () {
    return (
			<MuiThemeProvider>
				<div className="App" style={style1()}>
					<Header
						marquee={this.state.marquee}
						toggleDrawer={this.toggleDrawer}/>
					<Drawer
						isDrawerOpen={this.state.isDrawerOpen}
						toggleDrawer={this.toggleDrawer}
						routerRef={this.state.routerRef}/>
					<Main
						gotRouterRef={this.gotRouterRef}
						changeMarquee={this.changeMarquee}/>
					<Footer routerRef={this.state.routerRef}/>
				</div>
			</MuiThemeProvider>
    )
  },
	componentDidMount: function () {

		this.establishSession()
	},
	componentDidUpdate: function () {
		
		if (this.state.refRouter && !localStorage.Jwt && location.pathname !== '/') this.state.refRouter.navigate('/')
		if (this.state.refRouter && localStorage.Jwt) this.state.refRouter.navigate('/outfit')
	},
	establishSession: function () {
		
		var expirationMs
		var expirationDate
		
		if (!localStorage.Jwt) return

		//jwt spec unconventionally defines seconds, not milliseconds for expiration
		expirationMs = utils.jwtPayload.exp * 1000
		expirationDate = new Date(expirationMs)
		
		//exp passed?
		if (expirationDate < new Date()) return localStorage.removeItem('jwt')		
			
		Request
		.put(env.backend+ '/jwt')
		.send({jwt: utils.jwt})
		.end((err, response) => {

			if (err || !response.body) {
				return localStorage.removeItem('jwt')
			}

			//cache renewed jwt
			localStorage.Jwt = JSON.stringify(response.body)
		})
	},
	changeMarquee: function (message, size) {
		
		this.setState({marquee: {
			message: message,
			size: size
		}})
	},
	toggleDrawer: function () {
		
		this.setState({isDrawerOpen: !this.state.isDrawerOpen})
	},
	gotRouterRef: function (routerRef) {

		this.setState({routerRef: routerRef}, () => this.state.routerRef.navigate('/'))
	}
})

function style1() {
	return {
		margin: '0 auto',
		fontFamily: 'Helvetica'
	}
}