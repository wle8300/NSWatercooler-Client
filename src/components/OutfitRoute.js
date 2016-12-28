import OutfitHome from './OutfitHome'
import OutfitSingle from './OutfitSingle'

import React from 'react'
// import Request from 'superagent'


module.exports = React.createClass({
	propTypes: {
		_Outfit_: React.PropTypes.string,
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		changeMarquee: React.PropTypes.func.isRequired,
		changeFooter: React.PropTypes.func.isRequired
	},
  render: function () {
    return (
			<div>
				{
					!this.props._Outfit_
					? <OutfitHome routerRef={this.props.routerRef} changeMarquee={this.props.changeMarquee}/>
					: <OutfitSingle routerRef={this.props.routerRef} changeMarquee={this.props.changeMarquee} _Outfit_={this.props._Outfit_}/>
				}
			</div>
    )
  },
	componentWillMount: function () {
		this.props.changeFooter(true)
	},
})