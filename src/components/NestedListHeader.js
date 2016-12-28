import React from 'react'


module.exports = React.createClass({
	render: function () {
		return <h5 style={style1()}>{this.props.children}</h5>
	}
})

function style1() {
	return {
		margin: '0.5rem 0 1rem 0',
		textTransform: 'uppercase',
		opacity: 0.7
	}
}