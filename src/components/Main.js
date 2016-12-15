import React from 'react'
var Router = require('react-router-component')
var Location = Router.Location
var Locations = Router.Locations
var NotFound = Router.NotFound

var Outfit = require('./Outfit')
var Home = require('./Home')
var Player = require('./Player')
var Http404 = require('./Http404')
// var User = require('./User')


module.exports = React.createClass({
	propTypes: {
		jwt: React.PropTypes.string,
		user: React.PropTypes.object,
		onJwt: React.PropTypes.func.isRequired,
		onUser: React.PropTypes.func.isRequired,
		changeMarquee: React.PropTypes.func.isRequired
	},
	router: null,
	render: function () {
		return (
			<Locations ref={(router) => {this.router = router}}>
				<Location path="/" handler={Home} changeMarquee={this.props.changeMarquee}/>
				<Location
					routerRef={this.router}
					path={/\/outfit\/?(.+)?/}
					handler={Outfit}
					urlPatternOptions={['_Outfit_']}
					jwt={this.props.jwt}
					user={this.props.user}
					changeMarquee={this.props.changeMarquee}/>
				<Location
					path={/\/player\/?(.+)?/}
					handler={Player}
					changeMarquee={this.props.changeMarquee}/>
			</Locations>
		)
	},
	componentDidMount: function () {
		
		this.router.navigate('/')
		this.props.gotRouterRef(this.router)
	}
})

/*
				{
					this.props.jwt && this.props.user
					? <Location jwt={this.props.jwt} user={this.props.user} onJwt={this.props.onJwt} onUser={this.props.onUser} path="/user" handler={User}/>
					: null
				}
	
*/