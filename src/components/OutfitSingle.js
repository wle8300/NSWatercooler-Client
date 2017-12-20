import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'
import size from '../size'
import color from '../color'
import Box from './Box'
import Fab from './Fab'
import OutfitCharacter from './OutfitCharacter'
import OutfitStatsDropdown from './OutfitStatsDropdown'
import EmblazonedText from './EmblazonedText'

import Moment from 'moment'
import React from 'react'
import Request from 'superagent'
// import Draggable from 'react-draggable'
// import MUISubheader from 'material-ui/Subheader'
import MUIFAB from 'material-ui/FloatingActionButton'
import MUIList from 'material-ui/List/List'
import MUIListItem from 'material-ui/List/ListItem'
import MUIDivider from 'material-ui/Divider'
import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import MUIBookmarkIcon from 'material-ui/svg-icons/action/bookmark'
import MUIBookmarkBorderIcon from 'material-ui/svg-icons/action/bookmark-border'
import VisibilitySensor from 'react-visibility-sensor'
import MUIStatsIcon from 'material-ui/svg-icons/social/poll'


module.exports = React.createClass({
	displayName: 'OutfitSingle',
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		changeMarquee: React.PropTypes.func.isRequired,
		changeFaction: React.PropTypes.func.isRequired,
		_Outfit_: React.PropTypes.string.isRequired
	},
	getInitialState: function () {
		return Shema.call(this, {
		  outfit: {},
			bookmark: {},
		  outfitCharacters: [],
		  outfitLogins: [],
			outfitCharacterLogins: [],
			isStatsDropdownExpanded: false,
		})
	},
	render: function () {

		const rankSortedCharacters = this.state.outfitCharacters
			.sort((characterA, characterB) => {
			  if (characterA.rank_ordinal > characterB.rank_ordinal) return 1
			  if (characterA.rank_ordinal < characterB.rank_ordinal) return -1
			  else return 0
			})

		const onlineCharacters = rankSortedCharacters.filter((character) => character.online_status !== "0")
		const onlineLeaders = onlineCharacters.filter((character) => character.rank === 'Leader')
		const onlineOfficers = onlineCharacters.filter((character) => character.rank === 'Officer')
		const onlineMembers = onlineCharacters.filter((character) => character.rank === 'Member')
		const onlinePrivates = onlineCharacters.filter((character) => character.rank === 'Private')


		return (
			<div style={{}}>

				{/* outfit alias
				emblazoned */}
				<EmblazonedText>
					{this.state.outfit.alias}
				</EmblazonedText>



				<Fab
					onTouchTap={this.toggleOutfitBookmark}
				>
					{
						Object.keys(this.state.bookmark).length
							? <MUIBookmarkIcon color="white"/>
							: <MUIBookmarkBorderIcon color="white"/>
					}
				</Fab>


				{/* "main" section */}

				<div style={{
					marginTop: `${size.headerHeight}rem`,
					paddingTop: '1rem',
					height: `calc(100vh - ${size.headerHeight + size.footerHeight}rem)`,
					overflow: 'scroll',
					WebkitOverflowScrolling: 'touch',
				}}>


					{/* header */}

					<Box style={{
						zIndex: 1,
						position : 'relative',
						justifyContent: 'space-between',
						margin : '0 1rem'
					}}>

						<div style={{
							padding: '0.75rem 0',
							fontSize: '1.5rem',
						}}>
							Online ({onlineCharacters.length})
						</div>

						<div
							onTouchTap={() => this.setState(Shema.call(this, {isStatsDropdownExpanded: !this.state.isStatsDropdownExpanded}, true))}
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								padding: '0.5rem',
								width: '2rem',
								height: '2rem',
								border: '0.1rem solid black',
								borderRadius: '100%',
								backgroundColor: '#f3f3f3'
							}}
						>
							<MUIStatsIcon/>
						</div>

					</Box>
					<OutfitStatsDropdown
						isExpanded={this.state.isStatsDropdownExpanded}
						memberCount={this.state.outfit.member_count}
						outfitCharacters={this.state.outfitCharacters}
						establishDate={this.state.outfit.time_created_date}
						outfitLogins={this.state.outfitLogins}
						closeHandler={() => this.setState(Shema.call(this, {isStatsDropdownExpanded: false}, true))}
					/>
					<MUIList>
						<div style={{
							position: 'relative',
							margin: '0 1rem 1rem 1rem',
							border: '0.25rem solid black',
							borderRadius: '0.25rem',
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
							<span style={{
								position : 'absolute',
								bottom: '-1.45rem',
								right : '1rem',
								padding : '0 0.25rem',
								borderTop : '0.5rem solid white',
							}}>
								<span style={{
									position: 'relative',
									top: '-0.75rem',
								}}>
									LEADERS
								</span>
							</span>
						</div>
						<div style={{
								position: 'relative',
								margin: '0 1rem 1rem 1rem',
								border: '0.25rem solid black',
								borderRadius: '0.25rem',
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
							<span style={{
								position : 'absolute',
								bottom: '-1.45rem',
								right : '1rem',
								padding : '0 0.25rem',
								borderTop : '0.5rem solid white',
							}}>
								<span style={{
									position: 'relative',
									top: '-0.75rem',
								}}>
									OFFICERS
								</span>
							</span>
						</div>
						<div style={{
							position: 'relative',
							margin: '0 1rem 1rem 1rem',
							border: '0.25rem solid black',
							borderRadius: '0.25rem',
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
							<span style={{
								position : 'absolute',
								bottom: '-1.45rem',
								right : '1rem',
								padding : '0 0.25rem',
								borderTop : '0.5rem solid white',
							}}>
								<span style={{
									position: 'relative',
									top: '-0.75rem',
								}}>
									MEMBERS
								</span>
							</span>
						</div>
						<div style={{
								position: 'relative',
								margin: '0 1rem 1rem 1rem',
								border: '0.25rem solid black',
								borderRadius: '0.25rem',
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
							<span style={{
								position : 'absolute',
								bottom: '-1.45rem',
								right : '1rem',
								padding : '0 0.25rem',
								borderTop : '0.5rem solid white',
							}}>
								<span style={{
									position: 'relative',
									top: '-0.75rem',
								}}>
									PRIVATES
								</span>
							</span>
						</div>
					</MUIList>
				</div>
			</div>
		)
	},
	componentDidMount: function () {

		this.readOutfitAndFaction()
		this.readOutfitCharacters()
		this.readOutfitBookmarks()
		this.readOutfitLoginMetrics()
	},
	readOutfitAndFaction: function () {

		return new Promise((resolve, reject) => {

			Request
			.get(env.backend+ '/outfit/' +this.props._Outfit_+ '?server=genudine')
			.end((err, response) => {

				if (err) throw err

				this.props.changeMarquee('[' +response.body.alias+ ']')
				this.setState(Shema.call(this, {outfit: response.body}, true), resolve)

				this.setState((prevState) => {

					Request
					.get(env.backend+ '/character/' +this.state.outfit.leader_character_id+ '?server=genudine')
					.end((err, response) => {

						//ns, vs, nc, tr
						this.props.changeFaction(response.body.faction.code_tag.toLowerCase())
					})
				})
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

				const findBookmark = () => response.body.filter((outfitBookmark) => outfitBookmark._Outfit_ === this.props._Outfit_)[0]
				const bookmark = findBookmark() ? findBookmark() : {}


				if (err) throw err

				this.setState(Shema.call(this, {
					bookmark: bookmark,
				}, true), resolve)
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


			this.setState(Shema.call(this, {
			  outfitCharacterLogins: outfitCharacterLoginsUpdated
			}, true))
		})
	},
	toggleOutfitBookmark: function () {

		if (!Object.keys(this.state.bookmark).length) {

			Request
			.post(env.backend+ '/outfit-bookmark')
			.set({Authorization: 'Bearer ' +utils.parseJwt()})
			.send({
				_Outfit_: this.state.outfit.outfit_id,
				outfitAlias: this.state.outfit.alias
			})
			.end((err, response) => {

				if (err) throw err

				this.readOutfitBookmarks()
			})
		}

		else {

			Request
			.delete(env.backend+ '/outfit-bookmark/' +this.state.bookmark.id)
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