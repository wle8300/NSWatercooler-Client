import env from '../../env'
import Shema from '../../shema'

import React from 'react'
import Request from 'superagent'
import MUIDrawer from 'material-ui/Drawer';
import MUIMenuItem from 'material-ui/MenuItem';


module.exports = React.createClass({
	displayName: 'Drawer',
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		isDrawerOpen: React.PropTypes.bool.isRequired,
		toggleDrawer: React.PropTypes.func.isRequired,
		restartSession: React.PropTypes.func.isRequired
	},
	getInitialState: function () {
		return Shema.call(this, {facilityTransfers: []})
	},
	render: function () {
		return (
			<MUIDrawer
				open={this.props.isDrawerOpen}
				docked={false}
				onRequestChange={this.props.toggleDrawer}>
				{
					localStorage.Jwt
					? (
						<div>
				      <MUIMenuItem
								onTouchTap={this.goToAccount}>
								Account
							</MUIMenuItem>
				      <MUIMenuItem
								onTouchTap={this.handleLogout}>
								Logout
							</MUIMenuItem>
						</div>
					)
					: (
			      <MUIMenuItem
							onTouchTap={() => {this.props.toggleDrawer(); this.props.routerRef.navigate('/login-signup')}}>
							Login
						</MUIMenuItem>
					)
				}
	      <MUIMenuItem
					onTouchTap={() => {window.location.href = 'mailto:' +env.supportEmail}}>
					Send us feedback
				</MUIMenuItem>
				{this.DominantOutfit()}
	    </MUIDrawer>
		)
	},
	componentDidMount: function () {

		this.readFacilityTransfers()
	},
	DominantOutfit: function () {

		//impure
		
		const transfersByOutfit = this.state.facilityTransfers.filter((facilityTransfer) => facilityTransfer._Outfit_ !== "0")
		const tally = {}

		transfersByOutfit.forEach(function(facilityTransfer) {
	    tally[facilityTransfer._Outfit_] = (tally[facilityTransfer._Outfit_] || 0) + 1
		})
				
		return <p>{Object.keys(tally).sort((a,b) => tally[b] - tally[a])[0]}</p>
	},
	readFacilityTransfers: function () {
		
		Request
		.get(env.backend+ '/facility-transfer?server=genudine&timeframe=week')
		.end((err, response) => {

			this.setState(Shema.call(this, {facilityTransfers: response.body}, true))
		})
	},
	goToAccount: function () {
		
		this.props.toggleDrawer()
		this.props.routerRef.navigate('/your-account')
	},
	handleLogout: function () {

		this.props.restartSession()
		this.props.routerRef.navigate('/login-signup')
	}
})