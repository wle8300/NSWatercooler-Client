import env from '../../env'

import Shema from '../../shema'

import React from 'react'
import Request from 'superagent'
import MUIList from 'material-ui/List/List'
import MUIListItem from 'material-ui/List/ListItem'
import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'


module.exports = React.createClass({
	displayName: 'OutfitSingle',
	propTypes: {
		_Outfit_: React.PropTypes.string
	},
	getInitialState: function () {
		return {
			outfit: Shema.call(this, 'outfit', {}),
			outfitCharacters: Shema.call(this, 'outfitCharacters', [])
		}
	},
	render: function () {
		return (
			<div>
				<h1>{this.state.outfit.alias}</h1>
				<MUIList>
					{
						this.state.outfitCharacters
						.filter((character) => character.online_status === '1000')
						.map((character) => {
							return (
								<MUIListItem
								  key={character.character_id}
								  primaryText={character.name.first}
								  rightIcon={<MUIArrowRight/>}/>
							)
						})
					}
				</MUIList>
			</div>
		)
	},
	componentDidMount: function () {

		if (!Object.keys(this.state.outfit).length) this.getOutfit()
		if (!this.state.outfitCharacters.length) this.getOutfitOnlineMembers()
	},
	getOutfit: function () {
		
		Request
		.get(env.backend+ '/outfit/' +this.props._Outfit_+ '?server=genudine')
		.end((err, response) => this.setState({outfit: Shema.call(this, 'outfit', response.body, true)}))
	},
	getOutfitOnlineMembers: function () {

		Request
		.get(env.backend+ '/outfit/' +this.props._Outfit_+ '/characters?server=genudine')
		.end((err, response) => this.setState({outfitCharacters: Shema.call(this, 'outfitCharacters', response.body, true)}))
	}
})