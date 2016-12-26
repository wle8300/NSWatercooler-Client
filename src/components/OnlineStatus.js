import React from 'react'


module.exports = React.createClass({
	propTypes: {
		isOnline: React.PropTypes.bool.isRequired,
		isLoading: React.PropTypes.bool.isRequired
	},
	render: function () {
		return <div style={style1(this.props)}></div>
	}
})

function style1(props, state) {
	return {
		position: 'absolute',
		left: '2rem',
		width: '1rem',
		height: '1rem',
		background: props.isOnline ? 'green' : 'orange',
		opacity: props.isLoading ? 0.1 : 1,
		borderRadius: '10rem',
	}
}