import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'

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
import MUIAddIcon from 'material-ui/svg-icons/av/playlist-add-check'
import MUIAddBorderIcon from 'material-ui/svg-icons/av/playlist-add'


module.exports = React.createClass({
	propTypes: {
		_Character_: React.PropTypes.string.isRequired,
		changeMarquee: React.PropTypes.func.isRequired
	},
	getInitialState: function () {
		return Shema.call(this, {character: {}, characterSubscriptions: [], characterLogins: []})
	},
  render: function () {
		
		const subscription = this.state.characterSubscriptions.filter((characterSubscription) => characterSubscription._Character_ === this.props._Character_)[0]
		const classPlayTimes = this.state.character.stats ? this.state.character.stats.stat.filter((x) => x.stat_name === 'play_time') : []
		const totalPlayTime = classPlayTimes.length ? classPlayTimes.reduce((sum, classPlayTime) => sum + parseInt(classPlayTime.value_forever, 10), 0) : 0
		const calcClassPlaytimePercentage = function (classPlayTimes, infantryClass) {
			
			if (infantryClass === 'infiltrator') return classPlayTimes.length ? classPlayTimes.filter((x) => x.profile_id === "1")[0].value_forever / totalPlayTime : 0
			if (infantryClass === 'light-assualt') return classPlayTimes.length ? classPlayTimes.filter((x) => x.profile_id === "3")[0].value_forever / totalPlayTime : 0
			if (infantryClass === 'medic') return classPlayTimes.length ? classPlayTimes.filter((x) => x.profile_id === "4")[0].value_forever / totalPlayTime : 0
			if (infantryClass === 'engineer') return classPlayTimes.length ? classPlayTimes.filter((x) => x.profile_id === "5")[0].value_forever / totalPlayTime : 0
			if (infantryClass === 'heavy') return classPlayTimes.length ? classPlayTimes.filter((x) => x.profile_id === "6")[0].value_forever / totalPlayTime : 0
			if (infantryClass === 'MAX') return classPlayTimes.length ? classPlayTimes.filter((x) => x.profile_id === "7")[0].value_forever / totalPlayTime : 0
		}
		
		
    return (
			<div style={style8(this.props, this.state)}>
				<MUIPaper zDepth={0} style={style3(this.props, this.state)}>
					<span style={style2()}>{this.state.character.battle_rank ? 'BR' +this.state.character.battle_rank.value : null}</span>
					<MUIFAB secondary onTouchTap={this.toggleCharacterSubscription.bind(this, subscription, this.state.character)} style={style1()}>
						{subscription ? <MUIAddIcon/> : <MUIAddBorderIcon/>}
					</MUIFAB>
					{
						!this.state.character.outfit_member
						? null 
						: (
						  <MUIPaper zDepth={0} style={{float: 'right', width: '33.33%', textAlign: 'center', background: 'transparent'}}>
								<span style={{textTransform: 'uppercase'}}>{this.state.character.outfit_member.member_rank}</span>
								<MUIDivider/>
								<span style={{fontSize: '0.75rem'}}>[{this.state.character.outfit_member.alias}]</span>
							</MUIPaper>	
						)
					}
					<MUIChip><MUIAvatar style={{background: this.state.character.online_status === '1000' ? 'green' : 'gray'}}/>{this.state.characterLogins.length ? Moment(this.state.characterLogins[0].time).fromNow() : null}</MUIChip>
				</MUIPaper>
				<MUIPaper key={new Date()} zDepth={0} style={style9()}>
				  <div style={style6()}>
						<div style={style4()}>Infiltrator</div>
						<div style={style5()}><MUILinearProgress mode={classPlayTimes.length ? 'determinate' : 'indeterminate'} value={100 * (calcClassPlaytimePercentage(classPlayTimes, 'infiltrator'))} style={style7()}/></div>
					</div>
				  <div style={style6()}>
						<div style={style4()}>Light Assault</div>
						<div style={style5()}><MUILinearProgress mode={classPlayTimes.length ? 'determinate' : 'indeterminate'} value={100 * (calcClassPlaytimePercentage(classPlayTimes, 'light-assualt'))} style={style7()}/></div>
					</div>
				  <div style={style6()}>
						<div style={style4()}>Medic</div>
						<div style={style5()}><MUILinearProgress mode={classPlayTimes.length ? 'determinate' : 'indeterminate'} value={100 * (calcClassPlaytimePercentage(classPlayTimes, 'medic'))} style={style7()}/></div>
					</div>
				  <div style={style6()}>
						<div style={style4()}>Engineer</div>
						<div style={style5()}><MUILinearProgress mode={classPlayTimes.length ? 'determinate' : 'indeterminate'} value={100 * (calcClassPlaytimePercentage(classPlayTimes, 'engineer'))} style={style7()}/></div>
					</div>
				  <div style={style6()}>
						<div style={style4()}>Heavy</div>
						<div style={style5()}><MUILinearProgress mode={classPlayTimes.length ? 'determinate' : 'indeterminate'} value={100 * (calcClassPlaytimePercentage(classPlayTimes, 'heavy'))} style={style7()}/></div>
					</div>
				  <div style={style6()}>
						<div style={style4()}>MAX</div>
						<div style={style5()}><MUILinearProgress mode={classPlayTimes.length ? 'determinate' : 'indeterminate'} value={100 * (calcClassPlaytimePercentage(classPlayTimes, 'MAX'))} style={style7()}/></div>
					</div>
				</MUIPaper>
			</div>
    )
  },
	componentDidMount: function () {

		this.readCharacter()
		this.readCharacterLogins()
		this.readCharacterSubscriptions()
	},
	readCharacter: function () {
		
		Request
		.get(env.backend+ '/character/' +this.props._Character_+ '?server=genudine')
		.end((err, response) => {

			this.props.changeMarquee(response.body.name.first)
			this.setState(Shema.call(this, {character: response.body}, true))
		})
	},
	readCharacterLogins: function () {
		
		Request
		.get(env.backend+ '/character/' +this.props._Character_+ '/logins')
		.end((err, response) => this.setState(Shema.call(this, {characterLogins: response.body}, true)))
	},
	readCharacterSubscriptions: function () {

		Request
		.get(env.backend+ '/user/' +utils.parseJwtPayload().id+ '/character-subscriptions')
		.set({Authorization: 'Bearer ' +utils.parseJwt()})
		.end((err, response) => this.setState(Shema.call(this, {characterSubscriptions: response.body}, true)))
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
		position: 'absolute',
    top: '0.25rem',
    right: '0.5rem',
    zIndex: 10000,
    padding: '0.125rem',
    fontWeight: 'bold',
    fontSize: '0.75rem',
    color: '#00bcd4',
    backgroundColor: 'white',
    borderRadius: '2px'
	}
}

function style3(props, state) {
	return {
		margin: '1.5rem',
		background: 'transparent'
	}
}

function style4() {
	return {
		width: '33.5%',
		padding: '1rem 0'
	}
}

function style5() {
	return {
		width: '66.5%'
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

function style8(props, state) {
	return {
		height: '100%',
		backgroundImage: Object.keys(state.character).length ? 'linear-gradient(rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 0%), url("https://census.daybreakgames.com/' +state.character.faction.image_path+ '")' : 'none',
		backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 0',
		backgroundSize: 'cover'
	}
}

function style9() {
	return {
		margin: '1.5rem',
		backgroundColor: 'transparent'
	}
}