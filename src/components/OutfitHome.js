import env from '../../env'
import Shema from '../../shema'

import DeciferJwtPayload from 'jwt-decode'
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
			<div className="Outfit-Search-Form" style={{margin: '1rem'}}>
				<MUIPaper style={{padding: '0 1rem'}}>
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

		// this.props.memsh(this.props.routerRef.url, 'outfitsSearchTerm', '')
		Request
		.get('http://localhost:3001/outfit?search=' +this.state.outfitsSearchTerm+ '&server=genudine')
		.end((err, response) => {
			
			if (err) throw err

			this.setState({outfitsSearchResults: Shema.call(this, 'outfitsSearchResults', response.body, true)})
		})
	},
	readOutfitBookmarks: function () {

		Request
		.get(env.backend+ '/user/' +(DeciferJwtPayload(JSON.parse(localStorage.Jwt).jwt).id)+ '/outfit-bookmarks')
		.set({Authorization: 'Bearer ' +JSON.parse(localStorage.Jwt).jwt})
		.end((err, response) => {

			this.setState({outfitBookmarks: Shema.call(this, 'outfitBookmarks', response.body, true)})
		})
	},
})