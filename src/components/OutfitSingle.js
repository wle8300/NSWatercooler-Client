import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'

import React from 'react'
import Request from 'superagent'
import MUIFAB from 'material-ui/FloatingActionButton';
import MUIList from 'material-ui/List/List'
import MUIListItem from 'material-ui/List/ListItem'
import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import MUIOutfitCharactersCountIcon from 'material-ui/svg-icons/action/assignment-ind'
import MUIAverageBRIcon from 'material-ui/svg-icons/places/spa'
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
	_calculateAvgBR: function (outfitCharacters) {
		
		const total = outfitCharacters.reduce((sum, character) => sum + parseInt(character.character.battle_rank.value, 10), 0)
		const length = outfitCharacters.length

		return parseInt(total/length, 10)
	},
	render: function () {

		const bookmark = this.state.outfitBookmarks.filter((outfitBookmark) => outfitBookmark._Outfit_ === this.props._Outfit_)[0]
		const onlineCharacters = this.state.outfitCharacters
			.filter((character) => character.online_status !== "0")
			.sort((characterA, characterB) => {
			  if (characterA.rank_ordinal > characterB.rank_ordinal) return 1
			  if (characterA.rank_ordinal < characterB.rank_ordinal) return -1
			  else return 0
			})
			.map((character) => {
				return (
					<MUIListItem
					  key={character.character_id}
					  primaryText={character.character.name.first}
						secondaryText={character.rank}
					  rightIcon={<MUIArrowRight/>}
						onTouchTap={() => this.props.routerRef.navigate('/character/' +character.character_id)}/>
				)
			})

		return (
			<div>
				<h1>{this.state.outfit.alias}</h1>
				<p><MUIOutfitCharactersCountIcon/> {this.state.outfit.member_count} members</p>
				<p><MUIAverageBRIcon/> {this.state.outfitCharacters.length ? this._calculateAvgBR(this.state.outfitCharacters)+ ' BattleRank™ AVG' : 'Crunching...'}</p>
				<MUIFAB secondary onTouchTap={this.toggleOutfitBookmark.bind(this, bookmark, this.state.outfit)} style={style1()}>
					{bookmark ? <MUIBookmarkIcon/> : <MUIBookmarkBorderIcon/>}
				</MUIFAB>
				<MUIList>
					<MUIListItem
						primaryText={'Online (' +onlineCharacters.length+ ')'}
						initiallyOpen={true}
	          primaryTogglesNestedList={true}
						nestedItems={onlineCharacters}/>
				</MUIList>
			</div>
		)
	},
	componentDidMount: function () {

		this.getOutfit()
		this.getOutfitCharacters()
		this.readOutfitBookmarks()
	},
	getOutfit: function () {
		
		Request
		.get(env.backend+ '/outfit/' +this.props._Outfit_+ '?server=genudine')
		.end((err, response) => this.setState(Shema.call(this, {outfit: response.body}, true)))
	},
	getOutfitCharacters: function () {

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

function style1() {
	return {
		position: 'fixed',
		zIndex: 1,
		bottom: '5rem',
		right: '1rem'
	}
}
