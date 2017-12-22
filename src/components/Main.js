import React from 'react'
var Router = require('react-router-component')
var Location = Router.Location
var Locations = Router.Locations
var NotFound = Router.NotFound

var WorldRoute = require('./WorldRoute')
var LoginSignupRoute = require('./LoginSignupRoute')
var AccountRoute = require('./AccountRoute')
var OutfitRoute = require('./OutfitRoute')
var CharacterRoute = require('./CharacterRoute')
var Http404 = require('./Http404')
// var User = require('./User')


module.exports = React.createClass({
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		changeMarquee: React.PropTypes.func.isRequired,
		changeFaction: React.PropTypes.func.isRequired,
		changeLoadingState: React.PropTypes.func.isRequired,
		changeFooter: React.PropTypes.func.isRequired,
		restartSession: React.PropTypes.func.isRequired
	},
	router: null,
	render: function () {
		return (
			<Locations ref={(router) => this.router = router}>
				<Location
					path="/"
					handler={WorldRoute}
					changeMarquee={this.props.changeMarquee}
					changeFaction={this.props.changeFaction}
					changeLoadingState={this.props.changeLoadingState}
					changeFooter={this.props.changeFooter}/>
				<Location
					path="/login-signup"
					handler={LoginSignupRoute}
					routerRef={this.props.routerRef}
					changeMarquee={this.props.changeMarquee}
					changeFaction={this.props.changeFaction}
					changeFooter={this.props.changeFooter}/>
				<Location
					path="/your-account"
					handler={AccountRoute}
					routerRef={this.router}
					changeMarquee={this.props.changeMarquee}
					changeFaction={this.props.changeFaction}
					changeFooter={this.props.changeFooter}
					restartSession={this.props.restartSession}/>
				<Location
					path={/\/outfit\/?(.+)?/}
					urlPatternOptions={['_Outfit_']}
					handler={OutfitRoute}
					routerRef={this.router}
					changeMarquee={this.props.changeMarquee}
					changeFaction={this.props.changeFaction}
					changeLoadingState={this.props.changeLoadingState}
					changeFooter={this.props.changeFooter}/>
				<Location
					path={/\/character\/?(.+)?/}
					urlPatternOptions={['_Character_']}
					handler={CharacterRoute}
					routerRef={this.router}
					changeMarquee={this.props.changeMarquee}
					changeFaction={this.props.changeFaction}
					changeLoadingState={this.props.changeLoadingState}
					changeFooter={this.props.changeFooter}/>
				<NotFound handler={Http404}/>
			</Locations>
		)
	},
	componentDidMount: function () {
		this.props.gotRouterRef(this.router)
	}
})