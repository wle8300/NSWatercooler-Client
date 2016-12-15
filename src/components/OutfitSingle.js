import env from '../../env'

import React from 'react'
import Request from 'superagent'


module.exports = React.createClass({
	propTypes: {
		_Outfit_: React.PropTypes.string
	},
	getInitialState: function () {
		return {
			outfit: {},
			outfitCharacters: []
		}
	},
	render: function () {
		return (
			<div>
				<h1>{this.state.outfit.alias}</h1>
				{
					this.state.outfitCharacters
					.filter((member) => member.online_status === '1000')
					.map((character) => <p>{character.name.first}</p>)
				}
			</div>
		)
	},
	componentDidMount: function () {
		
		this.getOutfit(this.props._Outfit_)
		this.getOutfitOnlineMembers(this.props._Outfit_)
	},
	getOutfit: function (_Outfit_) {
		
		Request
		.get(env.backend+ '/outfit/' +_Outfit_+ '?server=genudine')
		.end((err, response) => this.setState({outfit: response.body}))
	},
	getOutfitOnlineMembers: function (_Outfit_) {

		Request
		.get(env.backend+ '/outfit/' +_Outfit_+ '/characters?server=genudine')
		.end((err, response) => this.setState({outfitCharacters: response.body}))
	}
})