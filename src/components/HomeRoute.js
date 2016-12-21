import React from 'react'


module.exports = React.createClass({
	propTypes: {
		changeMarquee: React.PropTypes.func.isRequired
	},
  render: function () {
		
    return (
			<div>
				HOMEYA!
				{/*
					logged in
					? display "ALIAS" of previous week's most dominant outfit
					: register or login button
				*/}
			</div>
    )
  },
	componentWillMount: function () {
		this.props.changeMarquee('Home')
	}
})