import CharacterHome from './CharacterHome'
import CharacterSingle from './CharacterSingle'

import React from 'react'
// import Request from 'superagent'


module.exports = React.createClass({
	propTypes: {
		_Character_: React.PropTypes.string,
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		changeMarquee: React.PropTypes.func.isRequired,
		changeFooter: React.PropTypes.func.isRequired
	},
  render: function () {
    return (
			<div>
				{
					!this.props._Character_
					? <CharacterHome routerRef={this.props.routerRef} changeMarquee={this.props.changeMarquee}/>
					: <CharacterSingle _Character_={this.props._Character_} changeMarquee={this.props.changeMarquee}/>
				}
			</div>
    )
  },
	componentWillMount: function () {
		this.props.changeFooter(true)
	},
})