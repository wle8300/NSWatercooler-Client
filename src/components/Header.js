import React from 'react'
import MUIAppBar from 'material-ui/AppBar';

module.exports = React.createClass({
	propTypes: {
		marquee: React.PropTypes.string.isRequired
	},
	render: function () {
		return (
			<MUIAppBar zDepth={0} title={this.props.marquee}/>
		)
	}
})