import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'

import React from 'react'
import Request from 'superagent'
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
		return {
			charactersSearchTerm: Shema.call(this, 'charactersSearchTerm', ''),
			charactersSearchResults: Shema.call(this, 'charactersSearchResults', []),
			characterSubscriptions: Shema.call(this, 'characterSubscriptions', [])
		}
	},
  render: function () {
    return (
			<div>
				<MUIPaper style={{margin: '1rem', padding: '0 1rem'}}>
					<MUITextField
						value={this.state.charactersSearchTerm}
						onChange={(e) => this.setState({charactersSearchTerm: Shema.call(this, 'charactersSearchTerm', e.target.value, true)})}
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
				</MUIList>
			</div>
    )
		// {this.state.characterSubscriptions.map((characterSubscription) => {
		// 	return (
		// 		<MUIListItem
		// 		  key={characterSubscription.id}
		// 		  primaryText={characterSubscription.characterName}
		// 		  rightIcon={<MUIArrowRight/>}
		// 			onTouchTap={() => this.props.routerRef.navigate('/character/' +characterSubscription._Character_)}/>
		// 	)
		// })}
  },
	componentDidMount: function () {
		
		// this.readCharacterSubscriptions()
	},
	submitCharacterSearch: function (e) {
		
		e.preventDefault()

		Request
		.get(env.backend+ '/character?server=genudine&search=' +this.state.charactersSearchTerm+ '&limit=10')
		.end((err, response) => {
			
			if (err) throw err

			this.setState({charactersSearchResults: Shema.call(this, 'charactersSearchResults', response.body, true)})
		})
	},
	readCharacterSubscriptions: function () {

		Request
		.get(env.backend+ '/user/' +(utils.jwtPayload.id)+ '/character-subscriptions')
		.set({Authorization: 'Bearer ' +utils.jwt})
		.end((err, response) => {

			this.setState({characterSubscriptions: Shema.call(this, 'characterSubscriptions', response.body, true)})
		})
	}
})