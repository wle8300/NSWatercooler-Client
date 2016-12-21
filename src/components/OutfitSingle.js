import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'

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
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		_Outfit_: React.PropTypes.string.isRequired
	},
	getInitialState: function () {
		return Shema.call(this, {outfit: {}, outfitCharacters: [], outfitBookmarks: []})
	},
	render: function () {

		const bookmark = this.state.outfitBookmarks.filter((outfitBookmark) => outfitBookmark._Outfit_ === this.props._Outfit_)[0]
		
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
						.filter((character) => character.online_status !== '0')
						.map((character) => {
							return (
								<MUIListItem
								  key={character.character_id}
								  primaryText={character.name.first}
								  rightIcon={<MUIArrowRight/>}
									onTouchTap={() => this.props.routerRef.navigate('/character/' +character.character_id)}/>
							)
						})
					}
				</MUIList>
			</div>
		)
	},
	componentDidMount: function () {

		this.getOutfit()
		this.getOutfitMembers()
		this.readOutfitBookmarks()
	},
	getOutfit: function () {
		
		Request
		.get(env.backend+ '/outfit/' +this.props._Outfit_+ '?server=genudine')
		.end((err, response) => this.setState(Shema.call(this, {outfit: response.body}, true)))
	},
	getOutfitMembers: function () {

		Request
		.get(env.backend+ '/outfit/' +this.props._Outfit_+ '/characters?server=genudine')
		.end((err, response) => this.setState(Shema.call(this, {outfitCharacters: response.body}, true)))
	},
	readOutfitBookmarks: function () {

		Request
		.get(env.backend+ '/user/' +utils.jwtPayload.id+ '/outfit-bookmarks')
		.set({Authorization: 'Bearer ' +utils.jwt})
		.end((err, response) => this.setState(Shema.call(this, {outfitBookmarks: response.body}, true)))
	},
	toggleOutfitBookmark: function (bookmark, outfit) {
		
		if (!bookmark) {

			Request
			.post(env.backend+ '/outfit-bookmark')
			.set({Authorization: 'Bearer ' +utils.jwt})
			.send({
				_Outfit_: outfit.outfit_id,
				outfitAlias: outfit.alias
			})
			.end((err, response) => this.readOutfitBookmarks())
		}
		
		if (bookmark) {

			Request
			.delete(env.backend+ '/outfit-bookmark/' +bookmark.id)
			.set({Authorization: 'Bearer ' +utils.jwt})
			.end((err, response) => this.readOutfitBookmarks())
		}
	}
})