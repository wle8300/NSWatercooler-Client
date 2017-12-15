import React from 'react'


module.exports = React.createClass({
	propTypes: {
		isOnline: React.PropTypes.bool.isRequired,
		isLoading: React.PropTypes.bool.isRequired
	},
	render: function () {
		return <div style={this.style()}></div>
	},
	style: function () {
		return Object.assign({}, {
			width: '1rem',
			height: '1rem',
			background: this.props.isOnline
				? 'green'
				: 'orange',
			opacity: this.props.isLoading
				? 0.1
				: 1,
			borderRadius: '10rem'
		}, this.props.style)
	}
})