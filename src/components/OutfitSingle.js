import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'
import size from '../size'
import Box from './Box'
import OutfitCharacter from './OutfitCharacter'
import NestedListHeader from './NestedListHeader'

import Uuid from 'uuid/v4'
import Moment from 'moment'
import React from 'react'
import Request from 'superagent'
// import Draggable from 'react-draggable'
import MUIAvatar from 'material-ui/Avatar'
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
import VisibilitySensor from 'react-visibility-sensor'
import Bloom from 'react-bloom'


module.exports = React.createClass({
	displayName: 'OutfitSingle',
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		changeMarquee: React.PropTypes.func.isRequired,
		_Outfit_: React.PropTypes.string.isRequired
	},
	getInitialState: function () {
		return Shema.call(this, {
		  outfit: {},
		  outfitCharacters: [],
		  outfitBookmarks: [],
		  outfitLogins: [],
			outfitCharacterLogins: []
		})
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
		const outfitLeaders = rankSortedCharacters.filter((character) => character.rank === 'Leader')
		const outfitOfficers = rankSortedCharacters.filter((character) => character.rank === 'Officer')
		const outfitMembers = rankSortedCharacters.filter((character) => character.rank === 'Member')
		const outfitPrivates = rankSortedCharacters.filter((character) => character.rank === 'Private')

		const onlineCharacters = rankSortedCharacters.filter((character) => character.online_status !== "0")
		const onlineLeaders = onlineCharacters.filter((character) => character.rank === 'Leader')
		const onlineOfficers = onlineCharacters.filter((character) => character.rank === 'Officer')
		const onlineMembers = onlineCharacters.filter((character) => character.rank === 'Member')
		const onlinePrivates = onlineCharacters.filter((character) => character.rank === 'Private')

		const calcPercentageOutfitParticipation = (timeframe) => {

			const calcDataset = this.state.outfitLogins.filter((login) => new Date(login.time) > new Date(Moment().subtract(1, timeframe)))
			const uniqueCount = calcDataset
			.map((login) => login._Character_)
			.filter((_Character_, idx, array) => array.indexOf(_Character_) === idx).length

			return parseInt(100 *  uniqueCount / this.state.outfitCharacters.length, 10)+ '%'
		}

		return (
			<div style={{
				marginTop: `${size.headerHeight}rem`,
				height: `calc(100vh - ${size.headerHeight + size.footerHeight}rem)`,
				overflow: 'scroll',
				WebkitOverflowScrolling: 'touch',
			}}>
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
				{/* <MUIList>
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
					<div style={{display: 'flex', flexWrap: 'wrap'}}>
					<MUIChip style={style2()}><MUIAvatar>{outfitLeaders.length}</MUIAvatar>Leaders</MUIChip>
					<MUIChip style={style2()}><MUIAvatar>{outfitOfficers.length}</MUIAvatar>Officers</MUIChip>
					<MUIChip style={style2()}><MUIAvatar>{outfitMembers.length}</MUIAvatar>Members</MUIChip>
					<MUIChip style={style2()}><MUIAvatar>{outfitPrivates.length}</MUIAvatar>Privates</MUIChip>
					</div>
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
				</MUIList> */}
				<div style={{marginLeft: '1rem'}}>
					Online ({onlineCharacters.length})
				</div>
				<MUIList>
					<div style={{
						position: 'relative',
						margin: '0 1rem 1rem 1rem',
						border: '0.25rem solid black',
						borderRadius: 'calc(1rem / 4)',
					}}>
						{
							onlineLeaders.map((character) => {

								const characterLastLogin = this.state.outfitCharacterLogins.filter(($) => $._Character_ === character.character_id)[0]


								return (
									<VisibilitySensor key={character.character_id} onChange={(isVisible) => {this.readOutfitCharacterLogins(character.character_id)}}>
										<OutfitCharacter
											onTouchTap={() => this.props.routerRef.navigate('/character/' +character.character_id)}
											characterName={character.character.name.first}
											characterLastLogin={characterLastLogin ? Moment(characterLastLogin.login.time).fromNow() : null}
										/>
									</VisibilitySensor>
								)
							})
						}
						<span style={{position: 'absolute', right: '1rem', bottom: '-0.75rem', padding: '0 0.5rem', backgroundColor: 'white', color: 'black',}}>LEADERS</span>
					</div>
					<div style={{
							position: 'relative',
							margin: '0 1rem 1rem 1rem',
							border: '0.25rem solid black',
							borderRadius: 'calc(1rem / 4)',
					}}>
						{
							onlineOfficers.map((character) => {

								const characterLastLogin = this.state.outfitCharacterLogins.filter(($) => $._Character_ === character.character_id)[0]


								return (
									<VisibilitySensor key={character.character_id} onChange={(isVisible) => {this.readOutfitCharacterLogins(character.character_id)}}>
										<OutfitCharacter
											onTouchTap={() => this.props.routerRef.navigate('/character/' +character.character_id)}
											characterName={character.character.name.first}
											characterLastLogin={characterLastLogin ? Moment(characterLastLogin.login.time).fromNow() : null}
										/>
									</VisibilitySensor>
								)
							})
						}
						<span style={{position: 'absolute', right: '1rem', bottom: '-0.75rem', padding: '0 0.5rem', backgroundColor: 'white', color: 'black',}}>OFFICERS</span>
					</div>
					<div style={{
						position: 'relative',
						margin: '0 1rem 1rem 1rem',
						border: '0.25rem solid black',
						borderRadius: 'calc(1rem / 4)',
					}}>
						{
							onlineMembers.map((character) => {

								const characterLastLogin = this.state.outfitCharacterLogins.filter(($) => $._Character_ === character.character_id)[0]


								return (
									<VisibilitySensor key={character.character_id} onChange={(isVisible) => {this.readOutfitCharacterLogins(character.character_id)}}>
										<OutfitCharacter
											onTouchTap={() => this.props.routerRef.navigate('/character/' +character.character_id)}
											characterName={character.character.name.first}
											characterLastLogin={characterLastLogin ? Moment(characterLastLogin.login.time).fromNow() : null}
										/>
									</VisibilitySensor>
								)
							})
						}
						<span style={{position: 'absolute', right: '1rem', bottom: '-0.75rem', padding: '0 0.5rem', backgroundColor: 'white', color: 'black',}}>MEMBERS</span>
					</div>
					<div style={{
							position: 'relative',
							margin: '0 1rem 1rem 1rem',
							border: '0.25rem solid black',
							borderRadius: 'calc(1rem / 4)',
					}}>
						{
							onlinePrivates.map((character) => {

								const characterLastLogin = this.state.outfitCharacterLogins.filter(($) => $._Character_ === character.character_id)[0]


								return (
									<VisibilitySensor key={character.character_id} onChange={(isVisible) => {this.readOutfitCharacterLogins(character.character_id)}}>
										<OutfitCharacter
											onTouchTap={() => this.props.routerRef.navigate('/character/' +character.character_id)}
											characterName={character.character.name.first}
											characterLastLogin={characterLastLogin ? Moment(characterLastLogin.login.time).fromNow() : null}
										/>
									</VisibilitySensor>
								)
							})
						}
						<span style={{position: 'absolute', right: '1rem', bottom: '-0.75rem', padding: '0 0.5rem', backgroundColor: 'white', color: 'black',}}>PRIVATES</span>
					</div>
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

		return new Promise((resolve, reject) => {

			Request
			.get(env.backend+ '/outfit/' +this.props._Outfit_+ '?server=genudine')
			.end((err, response) => {

				if (err) throw err

				this.props.changeMarquee('[' +response.body.alias+ ']')
				this.setState(Shema.call(this, {outfit: response.body}, true), resolve)
			})
		})
	},
	readOutfitCharacters: function () {

		return new Promise((resolve, reject) => {

			Request
			.get(env.backend+ '/outfit/' +this.props._Outfit_+ '/characters?server=genudine')
			.end((err, response) => {

				if (err) throw err

				this.setState(Shema.call(this, {outfitCharacters: response.body}, true), resolve)
			})
		})
	},
	readOutfitBookmarks: function () {

		return new Promise((resolve, reject) => {

			Request
			.get(env.backend+ '/user/' +utils.parseJwtPayload().id+ '/outfit-bookmarks')
			.set({Authorization: 'Bearer ' +utils.parseJwt()})
			.end((err, response) => {

				if (err) throw err

				this.setState(Shema.call(this, {outfitBookmarks: response.body}, true), resolve)
			})
		})
	},
	readOutfitLoginMetrics: function () {

		return new Promise((resolve, reject) => {

			Request
			.get(env.backend+ '/login?_Outfit_=' +this.props._Outfit_+ '&timeframe=month')
			.end((err, response) => {

				if (err) throw err

				this.setState(Shema.call(this, {outfitLogins: response.body}, true), resolve)
			})
		})
	},
	readOutfitCharacterLogins: function (_Character_) {

		Request
		.get(env.backend+ '/character/' +_Character_+ '/logins')
		.end((err, response) => {

			if (!response.body.length) return


			const outfitCharacterLoginsUpdated = this.state.outfitCharacterLogins.filter((el) => el._Character_ !== _Character_).concat({_Character_: _Character_, login: response.body[0]})

			this.setState(
				Shema.call(
					this,
					{outfitCharacterLogins: outfitCharacterLoginsUpdated},
					true
				)
			)
		})
	},
	toggleOutfitBookmark: function (bookmark, outfit) {

		if (!bookmark) {

			Request
			.post(env.backend+ '/outfit-bookmark')
			.set({Authorization: 'Bearer ' +utils.parseJwt()})
			.send({
				_Outfit_: outfit.outfit_id,
				outfitAlias: outfit.alias
			})
			.end((err, response) => {

				if (err) throw err

				this.readOutfitBookmarks()
			})
		}

		if (bookmark) {

			Request
			.delete(env.backend+ '/outfit-bookmark/' +bookmark.id)
			.set({Authorization: 'Bearer ' +utils.parseJwt()})
			.end((err, response) => {

				if (err) throw err

				this.readOutfitBookmarks()
			})
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
		margin: '0.25rem'
	}
}