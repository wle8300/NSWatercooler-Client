import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'
import size from '../size'
import color from '../color'
import Fab from './Fab'
import OnlineStatus from './OnlineStatus'
import Box from './Box'
import EmblazonedText from './EmblazonedText'
import IconInfiltrator from '../icons/icon-infiltrator.png'
import IconLightAssault from '../icons/icon-light-assault.png'
import IconCombatMedic from '../icons/icon-combat-medic.png'
import IconEngineer from '../icons/icon-engineer.png'
import IconHeavyAssault from '../icons/icon-heavy-assault.png'
import IconMax from '../icons/icon-max.png'
import ProgressBar from './ProgressBar'


import React from 'react'
import Request from 'superagent'
import Moment from 'moment'
import MUIFAB from 'material-ui/FloatingActionButton';
import MUIChip from 'material-ui/Chip'
import MUIDivider from 'material-ui/Divider'
import MUIAvatar from 'material-ui/Avatar'
import MUIPaper from 'material-ui/Paper'
import MUILinearProgress from 'material-ui/LinearProgress';
// import MUICheckbox from 'material-ui/Checkbox'
// import MUIList from 'material-ui/List/List'
// import MUIListItem from 'material-ui/List/ListItem'
// import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import MUIBookmarkIcon from 'material-ui/svg-icons/action/bookmark'
import MUIBookmarkBorderIcon from 'material-ui/svg-icons/action/bookmark-border'


module.exports = React.createClass({
	propTypes: {
		_Character_: React.PropTypes.string.isRequired,
		changeMarquee: React.PropTypes.func.isRequired,
		changeFaction: React.PropTypes.func.isRequired
	},
	getInitialState: function () {
		return Shema.call(this, {
		  character: {},
		  characterSubscriptions: [],
		  characterLogins: [],
			faction: 'ns',
		})
	},
	_fontSize: '1.25rem',
	_color: '#42bdd5',
  render: function () {

		const subscription = this.state.characterSubscriptions.filter((characterSubscription) => characterSubscription._Character_ === this.props._Character_)[0]
		const classPlayTimes = this.state.character.stats ? this.state.character.stats.stat.filter((x) => x.stat_name === 'play_time') : []
		const totalPlayTime = classPlayTimes.length ? classPlayTimes.reduce((sum, classPlayTime) => sum + parseInt(classPlayTime.value_forever, 10), 0) : 0
		const calcClassPlaytimePercentage = function (classPlayTimes, infantryClass) {

			if (infantryClass === 'infiltrator') return classPlayTimes.length ? classPlayTimes.filter((x) => x.profile_id === "1")[0].value_forever / totalPlayTime : 0
			if (infantryClass === 'light-assualt') return classPlayTimes.length ? classPlayTimes.filter((x) => x.profile_id === "3")[0].value_forever / totalPlayTime : 0
			if (infantryClass === 'combat-medic') return classPlayTimes.length ? classPlayTimes.filter((x) => x.profile_id === "4")[0].value_forever / totalPlayTime : 0
			if (infantryClass === 'engineer') return classPlayTimes.length ? classPlayTimes.filter((x) => x.profile_id === "5")[0].value_forever / totalPlayTime : 0
			if (infantryClass === 'heavy-assault') return classPlayTimes.length ? classPlayTimes.filter((x) => x.profile_id === "6")[0].value_forever / totalPlayTime : 0
			if (infantryClass === 'max') return classPlayTimes.length ? classPlayTimes.filter((x) => x.profile_id === "7")[0].value_forever / totalPlayTime : 0
		}


    return (
			<div style={{
				// backgroundImage: Object.keys(this.state.character).length ? 'linear-gradient(rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 0%), url("https://census.daybreakgames.com/' +this.state.character.faction.image_path+ '")' : 'none',
				// backgroundRepeat: 'no-repeat',
				// backgroundPosition: '50% 0',
				// backgroundSize: 'cover',
			}}>



				{/* EmblazonedText */}
				{
					!this.state.character.outfit_member
						? null
						: (
							<EmblazonedText
								style={{
									// fontSize: '43vw',
									// transform: 'rotateZ(90deg) translateY(-36vw) translateX(43vw)',
								}}
							>
								<div>
									{this.state.character.outfit_member.alias.toUpperCase()}
								</div>
							</EmblazonedText>
						)
				}


				<Fab onTouchTap={this.toggleCharacterSubscription.bind(this, subscription, this.state.character)}>
					{
						subscription
							? <MUIBookmarkIcon color="white"/>
							: <MUIBookmarkBorderIcon color="white"/>
					}
				</Fab>



				<div style={{
					position: 'relative',
					marginTop: `${size.headerHeight}rem`,
					padding: '1rem',
					height: `calc(100vh - ${size.headerHeight + size.footerHeight}rem)`,
					overflow: 'scroll',
					WebkitOverflowScrolling: 'touch',
				}}>







					{/* ONLINE STATUS & BATTLERANK */}
					<Box style={{justifyContent: 'space-between', opacity: 0.65,}}>
						<Box style={{
							marginRight : '2%',
							width : '100%',
							// backgroundColor : this._color,
						}}>
							<Box style={{padding: '0.25rem', width: '100%',}}>
								<Box style={{
									justifyContent: 'center',
									alignItems: 'center',
									padding: '0 11% 0 0',
									// width: '11%',
								}}>
									<OnlineStatus
										isOnline={
											this.getOnlineStatusVerbiage() === "ONLINE"
												? true
												: false
										}
										isLoading={
											Object.keys(this.state.character).length
												? false
												: true
										}
									/>
								</Box>
								<div style={{
									padding: '8% 0',
								}}>
									<div style={{
										fontSize: '0.6rem',
										fontWeight: 'bold',
										letterSpacing: '0.06rem',
									}}>
										STATUS
									</div>
									<div style={{
										fontSize: this._fontSize,
									}}>
										{this.getOnlineStatusVerbiage()}
									</div>
									<div style={{
										fontSize: '0.7rem',
									}}>
										{
											this.state.characterLogins.length
												? Moment(this.state.characterLogins[0].time).fromNow()
												: '0 seconds ago'
										}
									</div>
								</div>
							</Box>
						</Box>
						<Box style={{
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							marginLeft : '2%',
							width : '100%',
							// backgroundColor : this._color,
						}}>
							<Box style={{
								// justifyContent: 'center',
								alignItems: 'center',
								fontSize: '0.6rem',
								fontWeight: 'bold',
								letterSpacing: '0.06rem',
							}}>
								BATTLERANK
							</Box>
							<Box style={{
								// justifyContent: 'center',
								alignItems: 'center',
								fontSize: '2rem',
								fontWeight: 'bold',
							}}>
								{this.state.character.battle_rank ? this.state.character.battle_rank.value : 0}
							</Box>
						</Box>

						{/* OUTFIT */}
						<Box style={{
							flexDirection: 'column',
							justifyContent : 'center',
							// alignItems : 'center',
							// margin: '0 0 3%',
							// padding : '1.5rem',
							width: '100%',
							// opacity : 0.65,
							// backgroundColor : this._color
						}}>
							{
								!this.state.character.outfit_member
									? null
									: (
										<Box
											style={{
												flexDirection: 'column',
												justifyContent : 'center',
											}}
										>
											<Box style={{
												justifyContent: 'center',
												alignItems: 'center',
												fontSize: '0.6rem',
												fontWeight: 'bold',
												letterSpacing: '0.06rem',
												textTransform: 'uppercase',
											}}>
												{this.state.character.outfit_member.member_rank.toUpperCase()}
											</Box>
											<Box
												style={{
													justifyContent: 'center',
													alignItems: 'center',
													fontSize: '2rem',
												}}
											>
												{this.state.character.outfit_member.alias}
											</Box>
										</Box>
									)
							}
						</Box>
					</Box>




					{/* CLASS PLAYTIMES */}
					<div style={{marginTop: '3%', padding: '0 0 3rem', opacity: 0.65}}>
						<div style={{
							padding: '1rem 0',
							// backgroundColor: this._color,
						}}>
							<Box>
								<div style={style4()}><img src={IconInfiltrator}/></div>
								<ProgressBar
									isLoading={classPlayTimes.length ? 'determinate' : 'indeterminate'}
									percent={100 * (calcClassPlaytimePercentage(classPlayTimes, 'infiltrator'))}
									color="black"
									shouldDisplayPercent={false}
									style={{margin: '0'}}
								/>
							</Box>
							<Box>
								<div style={style4()}><img src={IconLightAssault}/></div>
								<ProgressBar
									isLoading={classPlayTimes.length ? 'determinate' : 'indeterminate'}
									percent={100 * (calcClassPlaytimePercentage(classPlayTimes, 'light-assualt'))}
									color="black"
									shouldDisplayPercent={false}
									style={{margin: '0'}}
								/>
							</Box>
							<Box>
								<div style={style4()}><img src={IconCombatMedic}/></div>
								<ProgressBar
									isLoading={classPlayTimes.length ? 'determinate' : 'indeterminate'}
									percent={100 * (calcClassPlaytimePercentage(classPlayTimes, 'combat-medic'))}
									color="black"
									shouldDisplayPercent={false}
									style={{margin: '0'}}
								/>
							</Box>
							<Box>
								<div style={style4()}><img src={IconEngineer}/></div>
								<ProgressBar
									isLoading={!!classPlayTimes.length}
									percent={100 * (calcClassPlaytimePercentage(classPlayTimes, 'engineer'))}
									color="black"
									shouldDisplayPercent={false}
									style={{margin: '0'}}
									/>
									</Box>
									<Box>
									<div style={style4()}><img src={IconHeavyAssault}/></div>
									<ProgressBar
									isLoading={classPlayTimes.length ? 'determinate' : 'indeterminate'}
									percent={100 * (calcClassPlaytimePercentage(classPlayTimes, 'heavy-assault'))}
									color="black"
									shouldDisplayPercent={false}
									style={{margin: '0'}}
								/>
							</Box>
							<Box>
								<div style={style4()}><img src={IconMax}/></div>
								<ProgressBar
									isLoading={classPlayTimes.length ? 'determinate' : 'indeterminate'}
									percent={100 * (calcClassPlaytimePercentage(classPlayTimes, 'max'))}
									color="black"
									shouldDisplayPercent={false}
									style={{margin: '0'}}
								/>
							</Box>
						</div>
					</div>
				</div>
			</div>
		)
  },
	componentDidMount: function () {

		this.readCharacter()
		this.readCharacterLogins()
		this.readCharacterSubscriptions()
	},
	getOnlineStatusVerbiage: function () {

		switch (this.state.character.online_status) {

			case "1000":
				return "ONLINE"
			case "0":
				return "OFFLINE"
			default:
				return "LOADING"
		}
	},
	refreshHandler: function () {

		return new Promise((resolve, reject) => {

			Promise.all([
				this.readCharacter(),
				this.readCharacterLogins(),
				this.readCharacterSubscriptions(),
			])
			.then(resolve)
		})
	},
	readCharacter: function () {

		return new Promise((resolve, reject) => {

			Request
			.get(env.backend+ '/character/' +this.props._Character_+ '?server=genudine')
			.end((err, response) => {

				this.props.changeMarquee(response.body.name.first)
				this.props.changeFaction(response.body.faction.code_tag.toLowerCase())

				this.setState(Shema.call(this, {
				  character: response.body,
				}, true), resolve)
			})
		})
	},
	readCharacterLogins: function () {

		return new Promise((resolve, reject) => {

			Request
			.get(env.backend+ '/character/' +this.props._Character_+ '/logins')
			.end((err, response) => this.setState(Shema.call(this, {characterLogins: response.body}, true), resolve))
		})
	},
	readCharacterSubscriptions: function () {

		return new Promise((resolve, reject) => {

			Request
			.get(env.backend+ '/user/' +utils.parseJwtPayload().id+ '/character-subscriptions')
			.set({Authorization: 'Bearer ' +utils.parseJwt()})
			.end((err, response) => this.setState(Shema.call(this, {characterSubscriptions: response.body}, true), resolve))
		})
	},
	toggleCharacterSubscription: function (subscription, character) {

		if (!subscription) {

			Request
			.post(env.backend+ '/character-subscription')
			.set({Authorization: 'Bearer ' +utils.parseJwt()})
			.send({
				_User_: utils.parseJwtPayload().id,
				_Character_: character.character_id,
				characterName: character.name.first
			})
			.end((err, response) => this.readCharacterSubscriptions())
		}

		if (subscription) {

			Request
			.delete(env.backend+ '/character-subscription/' +subscription.id)
			.set({Authorization: 'Bearer ' +utils.parseJwt()})
			.end((err, response) => this.readCharacterSubscriptions())
		}
	}
})

function style4() {
	return {
		// width: '33.5%',
		padding: '1rem',
		filter: 'invert(100%)',
	}
}

function style5() {
	return {
		width: '100%',
	}
}

function style6() {
	return {
		display: 'flex'
	}
}

function style7() {
	return {
		height: '100%',
		backgroundColor: 'transparent',
		borderRadius: 0
	}
}

function style9() {
	return {
		margin: '1.5rem',
		backgroundColor: 'transparent'
	}
}