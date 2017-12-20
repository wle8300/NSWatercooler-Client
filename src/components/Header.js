import color from '../color'

import React from 'react'
import MUIAppBar from 'material-ui/AppBar';
import size from '../size'

module.exports = React.createClass({
	propTypes: {
		marquee: React.PropTypes.object.isRequired,
		faction: React.PropTypes.string.isRequired,
		toggleDrawer: React.PropTypes.func.isRequired
	},
	render: function () {
		return (
				<div style={{
					position: 'fixed',
					zIndex: 1,
					top: 0,
					width: '100%',
					height: `${size.headerHeight}rem`,
					backgroundColor: color[this.props.faction].standard,
					padding: '0 1rem',
					display: 'flex',
					alignItems: 'center',
					// height: '100%',
					fontSize: '1.56rem',
					color: 'white',
					transition: 'background-color 250ms linear',
				}}>
					<div>{this.props.marquee.message}</div>
					<div><small style={{marginLeft: '0.4rem', fontSize: '0.75rem', opacity: 0.5}}>GENUDINE</small></div>
				</div>
		)
	}
})
