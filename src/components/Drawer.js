import React from 'react'
import MUIDrawer from 'material-ui/Drawer';
import MUIMenuItem from 'material-ui/MenuItem';


module.exports = React.createClass({
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		isDrawerOpen: React.PropTypes.bool.isRequired,
		toggleDrawer: React.PropTypes.func.isRequired
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
			      <MUIMenuItem
							onTouchTap={this.goToAccount}>
							Account
						</MUIMenuItem>
					)
					: (
			      <MUIMenuItem
							onTouchTap={() => {this.props.toggleDrawer(); this.props.routerRef.navigate('/login-signup')}}>
							Login
						</MUIMenuItem>
					)
				}
	      <MUIMenuItem
					onTouchTap={this.handleLogout}>
					Logout
				</MUIMenuItem>
	    </MUIDrawer>
		)
	},
	goToAccount: function () {
		
		this.props.toggleDrawer()
		this.props.routerRef.navigate('/your-account')
	},
	handleLogout: function () {
		
		this.props.toggleDrawer()
		localStorage.removeItem('Jwt')
		this.props.routerRef.navigate('/')
	}
})