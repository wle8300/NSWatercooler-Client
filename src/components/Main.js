import React from 'react'
var Router = require('react-router-component')
var Location = Router.Location
var Locations = Router.Locations
var NotFound = Router.NotFound

var OutfitRoute = require('./OutfitRoute')
var HomeRoute = require('./HomeRoute')
var PlayerRoute = require('./PlayerRoute')
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
				<Location
					path="/"
					handler={HomeRoute}
					onJwt={this.props.onJwt}
					changeMarquee={this.props.changeMarquee}/>
				<Location
					routerRef={this.router}
					path={/\/outfit\/?(.+)?/}
					handler={OutfitRoute}
					urlPatternOptions={['_Outfit_']}
					jwt={this.props.jwt}
					onJwt={this.props.onJwt}
					user={this.props.user}
					changeMarquee={this.props.changeMarquee}/>
				<Location
					path={/\/player\/?(.+)?/}
					handler={PlayerRoute}
					changeMarquee={this.props.changeMarquee}/>
				<NotFound handler={Http404}/>
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