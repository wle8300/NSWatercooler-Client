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
	propTypes: {
		_Character_: React.PropTypes.string.isRequired
	},
	getInitialState: function () {
		return Shema.call(this, {character: {}, characterSubscriptions: []})
	},
  render: function () {
		
		const subscription = this.state.characterSubscriptions.filter((characterSubscription) => characterSubscription._Character_ === this.props._Character_)[0]
		
    return (
			<div>
				<h1>{this.state.character.name ? this.state.character.name.first : null}</h1>
		    <MUICheckbox
					onCheck={this.toggleCharacterSubscription.bind(this, subscription, this.state.character)}
		      checkedIcon={<MUIBookmarkIcon/>}
		      uncheckedIcon={<MUIBookmarkBorderIcon/>}
					checked={subscription ? true : false}
		      label="Bookmark"/>
				<div>creation, last login, battle_rank.value</div>
			</div>
    )
  },
	componentDidMount: function () {

		this.getCharacter()
		this.readCharacterSubscriptions()
	},
	getCharacter: function () {
		
		Request
		.get(env.backend+ '/character/' +this.props._Character_+ '?server=genudine')
		.end((err, response) => this.setState(Shema.call(this, {character: response.body}, true)))
	},
	readCharacterSubscriptions: function () {

		Request
		.get(env.backend+ '/user/' +utils.jwtPayload.id+ '/character-subscriptions')
		.set({Authorization: 'Bearer ' +utils.jwt})
		.end((err, response) => this.setState(Shema.call(this, {characterSubscriptions: response.body}, true)))
	},
	toggleCharacterSubscription: function (subscription, character) {
		
		if (!subscription) {

			Request
			.post(env.backend+ '/character-subscription')
			.set({Authorization: 'Bearer ' +utils.jwt})
			.send({
				_User_: utils.jwtPayload.id,
				_Character_: character.character_id,
				characterName: character.name.first
			})
			.end((err, response) => this.readCharacterSubscriptions())
		}
		
		if (subscription) {

			Request
			.delete(env.backend+ '/character-subscription/' +subscription.id)
			.set({Authorization: 'Bearer ' +utils.jwt})
			.end((err, response) => this.readCharacterSubscriptions())
		}
	}
})