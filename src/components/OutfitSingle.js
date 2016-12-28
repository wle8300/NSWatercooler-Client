import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'

import NestedListHeader from './NestedListHeader'

import Uuid from 'uuid/v4'
import Moment from 'moment'
import React from 'react'
import Request from 'superagent'
// import Draggable from 'react-draggable'
import MUIAvatar from 'material-ui/Avatar'
// import MUIPaper from 'material-ui/Paper'
// import MUISubheader from 'material-ui/Subheader'
import MUIFAB from 'material-ui/FloatingActionButton'
import MUIList from 'material-ui/List/List'
import MUIListItem from 'material-ui/List/ListItem'
import MUIChip from 'material-ui/Chip'
import MUIDivider from 'material-ui/Divider'
import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import MUIOutfitCharactersCountIcon from 'material-ui/svg-icons/action/assignment-ind'
import MUIAverageBRIcon from 'material-ui/svg-icons/social/poll'
import MUIBookmarkIcon from 'material-ui/svg-icons/action/bookmark'
import MUIBookmarkBorderIcon from 'material-ui/svg-icons/action/bookmark-border'


module.exports = React.createClass({
	displayName: 'OutfitSingle',
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		changeMarquee: React.PropTypes.func.isRequired,
		_Outfit_: React.PropTypes.string.isRequired
	},
	getInitialState: function () {
		return Shema.call(this, {outfit: {}, outfitCharacters: [], outfitBookmarks: [], outfitLogins: []})
	},
	_calculateAvgBR: function (outfitCharacters) {
		
		const total = outfitCharacters.reduce((sum, character) => sum + parseInt(character.character.battle_rank.value, 10), 0)
		const length = outfitCharacters.length

		return parseInt(total/length, 10)
	},
	render: function () {

		const bookmark = this.state.outfitBookmarks.filter((outfitBookmark) => outfitBookmark._Outfit_ === this.props._Outfit_)[0]
		const rankSortedCharacters = this.state.outfitCharacters
			.sort((characterA, characterB) => {
			  if (characterA.rank_ordinal > characterB.rank_ordinal) return 1
			  if (characterA.rank_ordinal < characterB.rank_ordinal) return -1
			  else return 0
			})
		const onlineCharacters = rankSortedCharacters
			.filter((character) => character.online_status !== "0")
		const outfitLeaders = rankSortedCharacters.filter((character) => character.rank === 'Leader')
		const outfitOfficers = rankSortedCharacters.filter((character) => character.rank === 'Officer')
		const outfitMembers = rankSortedCharacters.filter((character) => character.rank === 'Member')
		const outfitPrivates = rankSortedCharacters.filter((character) => character.rank === 'Private')
		const calcPercentageOutfitParticipation = (timeframe) => {
			
			const calcDataset = this.state.outfitLogins.filter((login) => new Date(login.time) > new Date(Moment().subtract(1, timeframe)))
			const uniqueCount = calcDataset
				.map((login) => login._Character_)
				.filter((_Character_, idx, array) => array.indexOf(_Character_) === idx).length
			
			return parseInt(100 *  uniqueCount / this.state.outfitCharacters.length, 10)+ '%'
		}

		return (
			<div>
				<MUIFAB secondary onTouchTap={this.toggleOutfitBookmark.bind(this, bookmark, this.state.outfit)} style={style1()}>
					{bookmark ? <MUIBookmarkIcon/> : <MUIBookmarkBorderIcon/>}
				</MUIFAB>
				<MUIList>
					<MUIListItem
						leftIcon={<MUIOutfitCharactersCountIcon/>}
						primaryText={this.state.outfit.member_count ? this.state.outfit.member_count+ ' Members' : 'Crunching...'}
						disabled/>
					<MUIListItem
						leftIcon={<MUIAverageBRIcon/>}
						primaryText={this.state.outfitCharacters.length ? this._calculateAvgBR(this.state.outfitCharacters)+ ' Average BattleRank' : 'Crunching...'}
						disabled/>
				</MUIList>
				<MUIDivider/>
				<MUIList>
					<MUIListItem
						primaryText="Information"
						initiallyOpen={false}
	          primaryTogglesNestedList={true}
						nestedItems={[
							<MUIListItem 
								key={Uuid()}
								disabled
								children={[
									<NestedListHeader>Established</NestedListHeader>,
									<div>{this.state.outfit.time_created_date ? Moment(this.state.outfit.time_created_date).fromNow() : 'Loading...'}</div>
								]}/>,
							<MUIListItem 
								key={Uuid()}
								disabled
								children={[
									<NestedListHeader>Composition</NestedListHeader>,
									<MUIChip style={style2()}><MUIAvatar>{outfitLeaders.length}</MUIAvatar>Leaders</MUIChip>,
									<MUIChip style={style2()}><MUIAvatar>{outfitOfficers.length}</MUIAvatar>Officers</MUIChip>,
									<MUIChip style={style2()}><MUIAvatar>{outfitMembers.length}</MUIAvatar>Members</MUIChip>,
									<MUIChip style={style2()}><MUIAvatar>{outfitPrivates.length}</MUIAvatar>Privates</MUIChip>
								]}/>,
							<MUIListItem 
								key={Uuid()}
								disabled
								children={[
									<NestedListHeader>Login Activity</NestedListHeader>,
									<MUIList>
										<MUIListItem
											primaryText="Past Month"
											rightAvatar={<MUIAvatar>{calcPercentageOutfitParticipation('month')}</MUIAvatar>}
											disabled/>
										<MUIListItem
											primaryText="Week"
											rightAvatar={<MUIAvatar>{calcPercentageOutfitParticipation('week')}</MUIAvatar>}
											disabled/>
										<MUIListItem
											primaryText="Day"
											rightAvatar={<MUIAvatar>{calcPercentageOutfitParticipation('day')}</MUIAvatar>}
											disabled/>
									</MUIList>
								]}/>
						]}/>
				</MUIList>
				<MUIDivider/>
				<MUIList>
					<MUIListItem
						primaryText={'Online (' +onlineCharacters.length+ ')'}
						initiallyOpen={true}
	          primaryTogglesNestedList={true}
						nestedItems={onlineCharacters.map((character) =>
							<MUIListItem
							  key={character.character_id}
							  primaryText={character.character.name.first}
								secondaryText={character.rank}
							  rightIcon={<MUIArrowRight/>}
								onTouchTap={() => this.props.routerRef.navigate('/character/' +character.character_id)}/>)}/>
				</MUIList>
			</div>
		)
	},
	componentDidMount: function () {

		this.readOutfit()
		this.readOutfitCharacters()
		this.readOutfitBookmarks()
		this.readOutfitLoginMetrics()
	},
	readOutfit: function () {
		
		Request
		.get(env.backend+ '/outfit/' +this.props._Outfit_+ '?server=genudine')
		.end((err, response) => {
			
			this.props.changeMarquee('[' +response.body.alias+ ']')
			this.setState(Shema.call(this, {outfit: response.body}, true))
		})
	},
	readOutfitCharacters: function () {

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
	readOutfitLoginMetrics: function () {
		
		Request
		.get(env.backend+ '/login?_Outfit_=' +this.props._Outfit_+ '&timeframe=month')
		.end((err, response) => this.setState(Shema.call(this, {outfitLogins: response.body}, true)))
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

function style2() {
	return {
		margin: '0.25rem 0'
	}
}