import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'

import OnlineStatus from './OnlineStatus'

import React from 'react'
import Moment from 'moment'
import InfiniteScroll from 'react-infinite'
import Request from 'superagent'
import VisibilitySensor from 'react-visibility-sensor'
import MUIList from 'material-ui/List/List'
import MUIListItem from 'material-ui/List/ListItem'
import MUITextField from 'material-ui/TextField'
import MUIRaisedButton from 'material-ui/RaisedButton'
import MUIPaper from 'material-ui/Paper'
import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'


module.exports = React.createClass({
	displayName: 'CharacterHome',
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		changeMarquee: React.PropTypes.func.isRequired
	},
	getInitialState: function () {
		return Shema.call(this, {charactersSearchTerm: '', charactersSearchResults: [], characterSubscriptions: [], VIZCOLLECTIONCharcterSubscriptionsOnlineStatus: [], VIZCOLLECTIONcharacterSubscriptionsLogins: []})
	},
  render: function () {
    return (
			<div>
				<MUIPaper style={{margin: '1rem', padding: '0 1rem'}}>
					<MUITextField
						value={this.state.charactersSearchTerm}
						onChange={(e) => this.setState(Shema.call(this, {charactersSearchTerm: e.target.value}, true))}
						hintText="Lowercase minimum 3 characters"
						fullWidth
						underlineShow={false}/>
					<MUIRaisedButton
						label="Search"
						disabled={this.state.charactersSearchTerm.length < 3 ? true : false}
						onTouchTap={this.submitCharacterSearch}
						secondary
						fullWidth/>
					<MUIList>
						{this.state.charactersSearchResults.map((character) => {
							return (
								<MUIListItem
								  key={character.character_id}
								  primaryText={character.name.first}
								  rightIcon={<MUIArrowRight/>}
									onTouchTap={() => this.props.routerRef.navigate('/character/' +character.character_id)}/>
							)
						})}
					</MUIList>
				</MUIPaper>
				<MUIList>
					<InfiniteScroll useWindowAsScrollContainer elementHeight={48}>
						{
							this.state.characterSubscriptions.map((characterSubscription) => {
							
								const characterOnlineStatus = this.state.VIZCOLLECTIONCharcterSubscriptionsOnlineStatus.filter((characterOnlineStatus) => characterOnlineStatus._Character_ === characterSubscription._Character_)[0]
								const characterLastLogin = this.state.VIZCOLLECTIONcharacterSubscriptionsLogins.filter((characterSubscriptionsLogin) => characterSubscriptionsLogin._Character_ === characterSubscription._Character_)[0]


								return (
									<VisibilitySensor key={characterSubscription.id} onChange={(isVisible) => {this.readCharacterOnlineStatus(characterSubscription._Character_, isVisible); this.readCharacterLogins(characterSubscription._Character_, isVisible)}}>
										<MUIListItem
										  key={characterSubscription.id}
										  primaryText={characterSubscription.characterName}
											secondaryText={characterLastLogin ? Moment(characterLastLogin.login.time).fromNow() : null}
											leftIcon={<OnlineStatus isOnline={characterOnlineStatus ? characterOnlineStatus.isOnline : false} isLoading={!characterOnlineStatus ? true : false}/>}
										  rightIcon={<MUIArrowRight/>}
											onTouchTap={() => this.props.routerRef.navigate('/character/' +characterSubscription._Character_)}/>
									</VisibilitySensor>
								)
							})
						}
					</InfiniteScroll>
				</MUIList>
			</div>
    )
  },
	componentDidMount: function () {
		
		this.props.changeMarquee('Character')
		this.readCharacterSubscriptions()
	},
	submitCharacterSearch: function (e) {
		
		e.preventDefault()

		Request
		.get(env.backend+ '/character?server=genudine&search=' +this.state.charactersSearchTerm+ '&limit=10')
		.end((err, response) => {
			
			if (err) throw err

			this.setState(Shema.call(this, {charactersSearchResults: response.body}, true))
		})
	},
	readCharacterSubscriptions: function () {

		console.log(1,);
		Request
		.get(env.backend+ '/user/' +(utils.parseJwtPayload().id)+ '/character-subscriptions')
		.set({Authorization: 'Bearer ' +utils.parseJwt()})
		.end((err, response) => {

			this.setState(Shema.call(this, {characterSubscriptions: response.body}, true))
		})
	},
	readCharacterOnlineStatus: function (_Character_, isVisible) {
		
		const alreadyLoaded = !!this.state.VIZCOLLECTIONCharcterSubscriptionsOnlineStatus.filter((characterOnlineStatus) => characterOnlineStatus._Character_ === _Character_).length

		if (isVisible && !alreadyLoaded) {

			Request
			.get(env.backend+ '/character/' +_Character_+ '?server=genudine')
			.end((err, response) => this.setState(Shema.call(this, {VIZCOLLECTIONCharcterSubscriptionsOnlineStatus: this.state.VIZCOLLECTIONCharcterSubscriptionsOnlineStatus.concat({_Character_: _Character_, isOnline: response.body.online_status !== "0" ? true : false})}, true)))
		}
	},
	readCharacterLogins: function (_Character_, isVisible) {

		const alreadyLoaded = !!this.state.VIZCOLLECTIONcharacterSubscriptionsLogins.filter((characterLogin) => characterLogin._Character_ === _Character_).length

		if (isVisible && !alreadyLoaded) {

			Request
			.get(env.backend+ '/character/' +_Character_+ '/logins')
			.end((err, response) => {

				if (!response.body.length) return
					
				this.setState(Shema.call(this, {VIZCOLLECTIONcharacterSubscriptionsLogins: this.state.VIZCOLLECTIONcharacterSubscriptionsLogins.concat({_Character_: _Character_, login: response.body[0]})}, true))
			})
		}
	}
})