import React from 'react'


module.exports = React.createClass({
	propTypes: {
		changeMarquee: React.PropTypes.func.isRequired,
		changeFooter: React.PropTypes.func.isRequired
	},
	render: function () {
		return (
			<div>
				yadayada change your email or password here!
			</div>
		)
	},
	componentWillMount: function () {

		this.props.changeMarquee('Account')
		this.props.changeFooter(false)
	},
})