import OutfitSearchForm from './OutfitSearchForm'
import OutfitSingle from './OutfitSingle'

import React from 'react'
// import Request from 'superagent'


module.exports = React.createClass({
	propTypes: {
		_Outfit_: React.PropTypes.string,
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		changeMarquee: React.PropTypes.func.isRequired
	},
	getInitialState: function () {
		return {}
	},
  render: function () {
    return (
			<div>
				{
					!this.props._Outfit_
					? <OutfitSearchForm routerRef={this.props.routerRef}/>
					: <OutfitSingle _Outfit_={this.props._Outfit_}/>
				}
			</div>
    )
  },
	componentWillMount: function () {
		
		this.props.changeMarquee('Outfit')
	},
})