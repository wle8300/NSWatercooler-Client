import React from 'react'
var Router = require('react-router-component')
var Location = Router.Location
var Locations = Router.Locations
var NotFound = Router.NotFound

var HomeRoute = require('./HomeRoute')
var LoginSignupRoute = require('./LoginSignupRoute')
var AccountRoute = require('./AccountRoute')
var OutfitRoute = require('./OutfitRoute')
var CharacterRoute = require('./CharacterRoute')
var Http404 = require('./Http404')
// var User = require('./User')


module.exports = React.createClass({
	propTypes: {
		changeMarquee: React.PropTypes.func.isRequired
	},
	router: null,
	render: function () {
		return (
			<Locations ref={(router) => this.router = router}>
				<Location
					path="/login-signup"
					handler={LoginSignupRoute}
					changeMarquee={this.props.changeMarquee}/>
				<Location
					path="/your-account"
					handler={AccountRoute}
					changeMarquee={this.props.changeMarquee}/>
				<Location
					path="/"
					handler={HomeRoute}
					changeMarquee={this.props.changeMarquee}/>
				<Location
					path={/\/outfit\/?(.+)?/}
					urlPatternOptions={['_Outfit_']}
					handler={OutfitRoute}
					routerRef={this.router}
					changeMarquee={this.props.changeMarquee}/>
				<Location
					path={/\/character\/?(.+)?/}
					urlPatternOptions={['_Character_']}
					handler={CharacterRoute}
					routerRef={this.router}
					changeMarquee={this.props.changeMarquee}/>
				<NotFound handler={Http404}/>
			</Locations>
		)
	},
	componentDidMount: function () {
		this.props.gotRouterRef(this.router)
	}
})