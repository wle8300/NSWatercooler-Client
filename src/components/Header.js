import React from 'react'
import MUIAppBar from 'material-ui/AppBar';

module.exports = React.createClass({
	propTypes: {
		marquee: React.PropTypes.object.isRequired
	},
	render: function () {
		return (
			<MUIAppBar
				zDepth={0}
				title={this.props.marquee.message}
				style={style1(this.props)}/>
		)
	}
})

function style1(props, state) {
	
	function height () {
		if (props.marquee.size === 'normal') return 100
		if (props.marquee.size === 'jumbo') return 150
	}
	
	return {
		height: height()
	}
}