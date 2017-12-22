import env from '../env'
import utils from '../utils'
import color from './color'

import Main from './components/Main'
import Header from './components/Header'
import Drawer from './components/Drawer'
import Footer from './components/Footer'

import Request from 'superagent'
import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme';


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
			faction: 'ns',
			isLoading: false,
			isDrawerOpen: false,
			arePageButtonsVisible: true
		}
	},
  render: function () {

		const theme = getMuiTheme({
			palette: {
				primary1Color: color[this.state.faction].standard,
		    // primary2Color: cyan700,
		    // primary3Color: grey400,
		    accent1Color: color[this.state.faction].alt,
		    // accent2Color: grey100,
		    // accent3Color: grey500,
		    textColor: color[this.state.faction].standard,
		    // alternateTextColor: white,
		    // canvasColor: white,
		    // borderColor: grey300,
		    // disabledColor: fade(darkBlack, 0.3),
		    // pickerHeaderColor: cyan500,
		    // clockCircleColor: fade(darkBlack, 0.07),
		    // shadowColor: fullBlack,
		  },
		  appBar: {
		    height: 50,
		  },
		})


    return (
			<MuiThemeProvider muiTheme={theme}>
				<div
					className="App"
					style={{
						margin: '0 auto',
						backgroundColor: color[this.state.faction].lighter,
						transition: 'background-color 350ms linear',
					}}
				>
					<Header
						marquee={this.state.marquee}
						faction={this.state.faction}
						isLoading={this.state.isLoading}
						toggleDrawer={this.toggleDrawer}/>
					<Drawer
						isDrawerOpen={this.state.isDrawerOpen}
						toggleDrawer={this.toggleDrawer}
						routerRef={this.state.routerRef}
						restartSession={this.restartSession}/>
					<Main
						routerRef={this.state.routerRef}
						gotRouterRef={this.gotRouterRef}
						changeMarquee={this.changeMarquee}
						changeFaction={this.changeFaction}
						changeLoadingState={this.changeLoadingState}
						changeFooter={this.changeFooter}
						restartSession={this.restartSession}/>
					<Footer routerRef={this.state.routerRef} arePageButtonsVisible={this.state.arePageButtonsVisible}/>
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

		//jwt uses seconds, not milliseconds
		expirationMs = utils.parseJwtPayload().exp * 1000
		expirationDate = new Date(expirationMs)

		//exp passed?
		if (expirationDate < new Date()) return localStorage.removeItem('jwt')

		Request
		.put(env.backend+ '/jwt')
		.send({jwt: utils.parseJwt()})
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
	changeFaction: function (faction) {

		this.setState({faction: faction})
	},
	changeLoadingState: function (isLoading) {

		this.setState({isLoading: isLoading})
	},
	changeFooter: function (isVisible) {

		this.setState({arePageButtonsVisible: isVisible})
	},
	toggleDrawer: function () {

		this.setState({isDrawerOpen: !this.state.isDrawerOpen})
	},
	gotRouterRef: function (routerRef) {

		this.setState({routerRef: routerRef}, () => this.state.routerRef.navigate('/'))
	},
	restartSession: function () {

		localStorage.removeItem('Jwt')
		window[env.namespace] = {}
	}
})