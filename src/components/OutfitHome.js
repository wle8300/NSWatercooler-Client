import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'

import React from 'react'
import Request from 'superagent'
import VisibilitySensor from 'react-visibility-sensor'
// import MUIAvatar from 'material-ui/Avatar';
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
		changeMarquee: React.PropTypes.func.isRequired
	},
	getInitialState: function () {
		return Shema.call(this, {outfitsSearchTerm: '', outfitsSearchResults: [], outfitBookmarks: [], outfits: [], outfitsOnlineCount: []})
	},
	render : function () {
		return (
			<div>
				<MUIPaper style={{margin: '1rem', padding: '0 1rem'}}>
					<MUITextField
						value={this.state.outfitsSearchTerm}
						onChange={(e) => this.setState(Shema.call(this, {outfitsSearchTerm: e.target.value}, true))}
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
						
						// const outfit = this.state.outfits.filter((outfit) => outfit.id === outfitBookmark._Outfit_)[0]
						const outfitOnlineCount = this.state.outfitsOnlineCount.filter((outfitOnlineCount) => outfitOnlineCount._Outfit_ === outfitBookmark._Outfit_)[0]
						// {
						//   _Outfit_: [String object],
						//   onlineCount: [Number object]
						// }
						
						return (
							<VisibilitySensor key={outfitBookmark.id} onChange={(isVisible) => {this.readOutfit(outfitBookmark._Outfit_, isVisible); this.readOutfitOnlineMembers(outfitBookmark._Outfit_, isVisible)}}>
								<MUIListItem
									primaryText={outfitBookmark.outfitAlias}
									secondaryText={outfitOnlineCount ? outfitOnlineCount.onlineCount+ ' online' : 'Loading...'}
								  rightIcon={<MUIArrowRight/>}
									onTouchTap={() => this.props.routerRef.navigate('/outfit/' +outfitBookmark._Outfit_)}/>
							</VisibilitySensor>
						)
					})}
				</MUIList>
			</div>
		)
	},
	componentWillMount: function () {
		this.props.changeMarquee('Outfit')
	},
	componentDidMount: function () {
		
		this.readOutfitBookmarks()
	},
	submitOutfitSearch: function () {
		
		Request
		.get(env.backend+ '/outfit?server=genudine&search=' +this.state.outfitsSearchTerm)
		.end((err, response) => {
			
			if (err) throw err

			this.setState(Shema.call(this, {outfitsSearchResults: response.body}, true))
		})
	},
	readOutfitBookmarks: function () {

		Request
		.get(env.backend+ '/user/' +utils.parseJwtPayload().id+ '/outfit-bookmarks')
		.set({Authorization: 'Bearer ' +utils.parseJwt()})
		.end((err, response) => {

			this.setState(Shema.call(this, {outfitBookmarks: response.body}, true))
		})
	},
	readOutfit: function (_Outfit_, isVisible) {

		const isOutfitLoaded = !!this.state.outfits.filter((outfit) => outfit.outfit_id === _Outfit_).length

		if (isVisible && !isOutfitLoaded) {
			
			Request
			.get(env.backend+ '/outfit/' +_Outfit_+ '?server=genudine')
			.end((err, response) => this.setState(Shema.call(this, {outfits: this.state.outfits.concat(response.body)}, true)))
		}
	},
	readOutfitOnlineMembers: function (_Outfit_, isVisible) {

		const isOutfitOnlineCountLoaded = !!this.state.outfitsOnlineCount.filter((outfitOnlineCount) => outfitOnlineCount._Outfit_ === _Outfit_).length

		if (isVisible && !isOutfitOnlineCountLoaded) {
			
			Request
			.get(env.backend+ '/outfit/' +_Outfit_+ '/characters?server=genudine&filterOnline=true')
			.end((err, response) => this.setState(Shema.call(this, {outfitsOnlineCount: this.state.outfitsOnlineCount.concat({_Outfit_: _Outfit_, onlineCount: response.body.length})}, true)))
		}
	}
})