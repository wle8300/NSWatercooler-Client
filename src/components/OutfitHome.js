import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'

import React from 'react'
import Request from 'superagent'
import MUIPaper from 'material-ui/Paper'
// import MUIDivider from 'material-ui/Divider'
import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
// import MUIFlatButton from 'material-ui/FlatButton';
import MUIList from 'material-ui/List/List'
import MUIListItem from 'material-ui/List/ListItem'
import MUITextField from 'material-ui/TextField'
import MUIRaisedButton from 'material-ui/RaisedButton'
// import MUISubheader from 'material-ui/Subheader'


module.exports = React.createClass({
	displayName: 'OutfitHome',
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
	},
	getInitialState: function () {
		return {
			outfitsSearchTerm: Shema.call(this, 'outfitsSearchTerm', ''),
			outfitsSearchResults: Shema.call(this, 'outfitsSearchResults', []),
			outfitBookmarks: Shema.call(this, 'outfitBookmarks', [])
		}
	},
	render : function () {
		return (
			<div>
				<MUIPaper style={{margin: '1rem', padding: '0 1rem'}}>
					<MUITextField
						value={this.state.outfitsSearchTerm}
						onChange={(e) => this.setState({outfitsSearchTerm: Shema.call(this, 'outfitsSearchTerm', e.target.value, true)})}
						hintText="Lowercase minimum 3 characters"
						fullWidth
						underlineShow={false}/>
					<MUIRaisedButton
						label="Search"
						disabled={this.state.outfitsSearchTerm.length < 3 ? true : false}
						onTouchTap={this.submitOutfitSearch}
						secondary
						fullWidth/>
					<MUIList>
						{this.state.outfitsSearchResults.map((outfit) => {
							return (
								<MUIListItem
								  key={outfit.outfit_id}
								  primaryText={outfit.alias}
								  rightIcon={<MUIArrowRight/>}
									onTouchTap={() => this.props.routerRef.navigate('/outfit/' +outfit.outfit_id)}/>
							)
						})}
					</MUIList>
				</MUIPaper>
				<MUIList>
					{this.state.outfitBookmarks.map((outfitBookmark) => {
						return (
							<MUIListItem
							  key={outfitBookmark.id}
							  primaryText={outfitBookmark.outfitAlias}
							  rightIcon={<MUIArrowRight/>}
								onTouchTap={() => this.props.routerRef.navigate('/outfit/' +outfitBookmark._Outfit_)}/>
						)
					})}
				</MUIList>
			</div>
		)
	},
	componentDidMount: function () {
		
		this.readOutfitBookmarks()
	},
	submitOutfitSearch: function (e) {
		
		e.preventDefault()

		Request
		.get(env.backend+ '/outfit?server=genudine&search=' +this.state.outfitsSearchTerm)
		.end((err, response) => {
			
			if (err) throw err

			this.setState({outfitsSearchResults: Shema.call(this, 'outfitsSearchResults', response.body, true)})
		})
	},
	readOutfitBookmarks: function () {

		Request
		.get(env.backend+ '/user/' +utils.jwtPayload.id+ '/outfit-bookmarks')
		.set({Authorization: 'Bearer ' +utils.jwt})
		.end((err, response) => {

			this.setState({outfitBookmarks: Shema.call(this, 'outfitBookmarks', response.body, true)})
		})
	},
})