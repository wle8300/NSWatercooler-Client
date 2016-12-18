import env from '../../env'

import Shema from '../../shema'

import DeciferJwtPayload from 'jwt-decode'
import React from 'react'
import Request from 'superagent'
import MUICheckbox from 'material-ui/Checkbox';
import MUIList from 'material-ui/List/List'
import MUIListItem from 'material-ui/List/ListItem'
import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import MUIBookmarkIcon from 'material-ui/svg-icons/action/bookmark';
import MUIBookmarkBorderIcon from 'material-ui/svg-icons/action/bookmark-border';


module.exports = React.createClass({
	displayName: 'OutfitSingle',
	propTypes: {
		_Outfit_: React.PropTypes.string
	},
	getInitialState: function () {
		console.log(1);
		return {
			outfit: Shema.call(this, 'outfit', {}),
			outfitCharacters: Shema.call(this, 'outfitCharacters', []),
			outfitBookmarks: Shema.call(this, 'outfitBookmarks', [])
		}
	},
	render: function () {
		console.log(2, this.state.outfitBookmarks);
		const bookmark = this.state.outfitBookmarks.filter((outfitBookmark) => outfitBookmark._Outfit_ === this.state.outfit.outfit_id)[0]
		
		return (
			<div>
				<h1>{this.state.outfit.alias}</h1>
		    <MUICheckbox
					onCheck={this.toggleOutfitBookmark.bind(this, bookmark, this.state.outfit)}
		      checkedIcon={<MUIBookmarkIcon/>}
		      uncheckedIcon={<MUIBookmarkBorderIcon/>}
					checked={bookmark ? true : false}
		      label="Bookmark"/>
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

		this.getOutfit()
		this.getOutfitOnlineMembers()
		this.readOutfitBookmarks()
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
	},
	readOutfitBookmarks: function () {

		Request
		.get(env.backend+ '/user/' +(DeciferJwtPayload(JSON.parse(localStorage.Jwt).jwt).id)+ '/outfit-bookmarks')
		.set({Authorization: 'Bearer ' +JSON.parse(localStorage.Jwt).jwt})
		.end((err, response) => this.setState({outfitBookmarks: Shema.call(this, 'outfitBookmarks', response.body, true)}))
	},
	toggleOutfitBookmark: function (bookmark, outfit) {
		
		if (!bookmark) {

			Request
			.post(env.backend+ '/outfit-bookmark')
			.set({Authorization: 'Bearer ' +JSON.parse(localStorage.Jwt).jwt})
			.send({
				_Outfit_: outfit.outfit_id,
				outfitAlias: outfit.alias
			})
			.end((err, response) => this.readOutfitBookmarks())
		}
		
		if (bookmark) {

			Request
			.delete(env.backend+ '/outfit-bookmark/' +bookmark.id)
			.set({Authorization: 'Bearer ' +JSON.parse(localStorage.Jwt).jwt})
			.end((err, response) => this.readOutfitBookmarks())
		}
	}
})