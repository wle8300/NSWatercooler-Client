import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'
import size from '../size'

// import OnlineStatus from './OnlineStatus'

import React from 'react'
import Moment from 'moment'
// import InfiniteScroll from 'react-infinite'
import Request from 'superagent'
import VisibilitySensor from 'react-visibility-sensor'
import MUIList from 'material-ui/List/List'
import MUIListItem from 'material-ui/List/ListItem'
import MUITextField from 'material-ui/TextField'
import MUIRaisedButton from 'material-ui/RaisedButton'
import MUIPaper from 'material-ui/Paper'
import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
// import PullToRefresh from './PullToRefresh'
import ListItemCharacter from './ListItemCharacter'


module.exports = React.createClass({
	displayName: 'CharacterHome',
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		changeMarquee: React.PropTypes.func.isRequired
	},
	getInitialState: function () {
		return Shema.call(this, {
		  charactersSearchTerm: '',
		  charactersSearchResults: [],
		  characterSubscriptions: [],
		  charcterSubscriptionsOnlineStatus: [],
		  characterSubscriptionsLogins: [],
		})
	},
  render: function () {
    return (
			<div style={{
				marginTop: `${size.headerHeight}rem`,
				height: `calc(100vh - ${size.headerHeight + size.footerHeight}rem)`,
				overflow: 'scroll',
			}}>
				<MUIPaper style={{
					padding: '0 1rem',
					width: '100%',
					// zIndex: 1,
					// position: 'fixed',
					// height: `${size.formHeight}rem`,
				}}>
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
				<MUIList style={{
					// marginTop: `${size.formHeight}rem`,
					padding: 0,
					height: `calc(100vh - ${size.headerHeight + size.footerHeight}rem)`,
					overflow: 'scroll',
					WebkitOverflowScrolling: 'touch',
				}}>
					{/* <InfiniteScroll useWindowAsScrollContainer elementHeight={48}> */}
					{
						this.state.characterSubscriptions.map((characterSubscription) => {

							const characterOnlineStatus = this.state.charcterSubscriptionsOnlineStatus.filter((characterOnlineStatus) => characterOnlineStatus._Character_ === characterSubscription._Character_)[0]
							const characterLastLogin = this.state.characterSubscriptionsLogins.filter((characterSubscriptionsLogin) => characterSubscriptionsLogin._Character_ === characterSubscription._Character_)[0]


							return (
								<VisibilitySensor key={characterSubscription.id} onChange={(isVisible) => {this.readCharacterOnlineStatus(characterSubscription._Character_, isVisible); this.readCharacterLogins(characterSubscription._Character_, isVisible)}}>
									<ListItemCharacter
										onTouchTap={() => this.props.routerRef.navigate('/character/' +characterSubscription._Character_)}
										characterName={characterSubscription.characterName}
										characterLastLogin={characterLastLogin ? Moment(characterLastLogin.login.time).fromNow() : null}
										characterOnlineStatus={characterOnlineStatus}
									/>
								</VisibilitySensor>
							)
						})
					}
					{/* </InfiniteScroll> */}
				</MUIList>
			</div>
		)
  },
	componentDidMount: function () {

		this.props.changeMarquee('Character')
		this.readCharacterSubscriptions()
	},
	submitCharacterSearch: function (e) {

		const searchTermLowerCased = this.state.charactersSearchTerm.toLowerCase()


		e.preventDefault()

		Request
		.get(env.backend+ '/character?server=genudine&search=' +searchTermLowerCased+ '&limit=10')
		.end((err, response) => {

			if (err) throw err

			this.setState(Shema.call(this, {charactersSearchResults: response.body}, true))
		})
	},
	readCharacterSubscriptions: function () {

		return new Promise((resolve, reject) => {

			Request
			.get(env.backend+ '/user/' +(utils.parseJwtPayload().id)+ '/character-subscriptions')
			.set({Authorization: 'Bearer ' +utils.parseJwt()})
			.end((err, response) => {

				this.setState(Shema.call(this, {
				  characterSubscriptions: response.body
				}, true), resolve)
			})
		})
	},
	readCharacterOnlineStatus: function (_Character_, isVisible) {

		// const alreadyLoaded = !!this.state.charcterSubscriptionsOnlineStatus.filter((characterOnlineStatus) => characterOnlineStatus._Character_ === _Character_).length
		//
		// if (isVisible && !alreadyLoaded) {

			Request
			.get(env.backend+ '/character/' +_Character_+ '?server=genudine')
			.end((err, response) => {

				const charcterSubscriptionsOnlineStatusUpdated = this.state.charcterSubscriptionsOnlineStatus.filter((el) => el._Character_ !== _Character_)
				.concat({_Character_: _Character_, isOnline: response.body.online_status !== "0" ? true : false})

				this.setState(
					Shema.call(
						this,
						{
							charcterSubscriptionsOnlineStatus: charcterSubscriptionsOnlineStatusUpdated
						},
						true
					)
				)
			})
		// }
	},
	readCharacterLogins: function (_Character_, isVisible) {

		// const alreadyLoaded = !!this.state.characterSubscriptionsLogins.filter((characterLogin) => characterLogin._Character_ === _Character_).length

		// if (isVisible && !alreadyLoaded) {
		//
			Request
			.get(env.backend+ '/character/' +_Character_+ '/logins')
			.end((err, response) => {

				if (!response.body.length) return


				const characterSubscriptionsLoginsUpdated = this.state.characterSubscriptionsLogins.filter((el) => el._Character_ !== _Character_).concat({_Character_: _Character_, login: response.body[0]})


				this.setState(
					Shema.call(
						this,
						{characterSubscriptionsLogins: characterSubscriptionsLoginsUpdated},
						true
					)
				)
			})
		// }
	}
})