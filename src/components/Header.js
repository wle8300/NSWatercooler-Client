import React from 'react'
import MUIAppBar from 'material-ui/AppBar';

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
				style={style1(this.props)}/>
		)
	}
})
				// onLeftIconButtonTouchTap={this.props.toggleDrawer}

function style1(props, state) {
	
	function height () {
		if (props.marquee.size === 'normal') return 100
		if (props.marquee.size === 'jumbo') return 150
	}
	
	return {
		height: height()
	}
}