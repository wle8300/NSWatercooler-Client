import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'

import React from 'react'
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
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any])
	},
	getInitialState: function () {
		return Shema.call(this, {charactersSearchTerm: '', charactersSearchResults: [], characterSubscriptions: [], charctersOnlineMeta: []})
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
					{
						this.state.characterSubscriptions.map((characterSubscription) => {
							
							const characterMeta = this.state.charctersOnlineMeta.filter((characterMeta) => characterMeta._Character_ === characterSubscription._Character_)[0]
							
							return (
								<VisibilitySensor key={characterSubscription.id} onChange={this.readCharacterMeta.bind(this, characterSubscription._Character_)}>
									<MUIListItem
									  key={characterSubscription.id}
									  primaryText={characterSubscription.characterName}
										secondaryText={characterMeta ? (characterMeta.isOnline ? 'Online' : 'Offline') : 'Loading status...'}
									  rightIcon={<MUIArrowRight/>}
										onTouchTap={() => this.props.routerRef.navigate('/character/' +characterSubscription._Character_)}/>
								</VisibilitySensor>
							)
						})
					}
				</MUIList>
			</div>
    )
  },
	componentDidMount: function () {
		
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

		Request
		.get(env.backend+ '/user/' +(utils.jwtPayload.id)+ '/character-subscriptions')
		.set({Authorization: 'Bearer ' +utils.jwt})
		.end((err, response) => {

			this.setState(Shema.call(this, {characterSubscriptions: response.body.slice(0, 10)}, true))
		})
	},
	readCharacterMeta: function (_Character_, isVisible) {
		
		const isCharacterMetaLoaded = !!this.state.charctersOnlineMeta.filter((characterMeta) => characterMeta._Character_ === _Character_).length

		if (isVisible && !isCharacterMetaLoaded) {

			Request
			.get(env.backend+ '/character/' +_Character_+ '?server=genudine')
			.end((err, response) => this.setState(Shema.call(this, {charctersOnlineMeta: this.state.charctersOnlineMeta.concat({_Character_: _Character_, isOnline: response.body.online_status !== "0" ? true : false})}, true)))
		}
	}
})