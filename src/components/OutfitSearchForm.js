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
	getInitialState: function () {
		return {
			outfitsSearchTerm: '',
			outfitsSearchResults: []
		}
	},
	render : function () {
		return (
			<div className="Outfit-Search-Form" style={{margin: '1rem'}}>
				<MUIPaper style={{padding: '0 1rem'}}>
					<MUITextField
						value={this.state.outfitsSearchTerm}
						onChange={(e) => this.setState({outfitsSearchTerm: e.target.value})}
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
			</div>
		)
	},
	submitOutfitSearch: function (e) {
		
		e.preventDefault()

		// this.props.memsh(this.props.routerRef.url, 'outfitsSearchTerm', '')
		Request
		.get('http://localhost:3001/outfit?search=' +this.state.outfitsSearchTerm+ '&server=genudine')
		.end((err, response) => this.setState({outfitsSearchResults: response.body}))
	}
})