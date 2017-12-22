import React from 'react'


module.exports = React.createClass({
	render: function () {
		return <h5 style={style1()}>{this.props.children}</h5>
	}
})

function style1() {
	return {
		margin: '2rem 0 0.25rem 0',
		textTransform: 'uppercase',
		opacity: 0.7
	}
}