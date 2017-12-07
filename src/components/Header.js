import React from 'react'
import MUIAppBar from 'material-ui/AppBar';
import size from '../size'

module.exports = React.createClass({
	propTypes: {
		marquee: React.PropTypes.object.isRequired,
		toggleDrawer: React.PropTypes.func.isRequired
	},
	render: function () {
		return (
			<MUIAppBar
				zDepth={0}
				title={<div>{this.props.marquee.message} <small style={{fontSize: '0.75rem', opacity: 0.5}}>GENUDINE</small></div>}
				iconStyleLeft={{display: 'none'}}
				style={{
					position: 'fixed',
					top: 0,
					width: '100%',
					height: `${size.headerHeight}rem`,
				}}/>
		)
	}
})
