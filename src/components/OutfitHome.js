import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'

import React from 'react'
import Request from 'superagent'
import VisibilitySensor from 'react-visibility-sensor'
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
		return Shema.call(this, {outfitsSearchTerm: '', outfitsSearchResults: [], outfitBookmarks: [], outfitsOnlineCountMeta: []})
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
						
						const outfitMeta = this.state.outfitsOnlineCountMeta.filter((outfitMeta) => outfitMeta._Outfit_ === outfitBookmark._Outfit_)[0]
						
						return (
							<VisibilitySensor key={outfitBookmark.id} onChange={this.readOutfitOnlineMembers.bind(this, outfitBookmark._Outfit_)}>
								<MUIListItem
									primaryText={outfitBookmark.outfitAlias}
									secondaryText={(outfitMeta ? outfitMeta.onlineCount+ ' members online' : 'Loading online members...')}
								  rightIcon={<MUIArrowRight/>}
									onTouchTap={() => this.props.routerRef.navigate('/outfit/' +outfitBookmark._Outfit_)}/>
							</VisibilitySensor>
						)
					})}
				</MUIList>
			</div>
		)
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
		.get(env.backend+ '/user/' +utils.jwtPayload.id+ '/outfit-bookmarks')
		.set({Authorization: 'Bearer ' +utils.jwt})
		.end((err, response) => {

			this.setState(Shema.call(this, {outfitBookmarks: response.body}, true))
		})
	},
	readOutfitOnlineMembers: function (_Outfit_, isVisible) {
		
		const isOutfitMetaLoaded = !!this.state.outfitsOnlineCountMeta.filter((outfitMeta) => outfitMeta._Outfit_ === _Outfit_).length

		if (isVisible && !isOutfitMetaLoaded) {
			
			Request
			.get(env.backend+ '/outfit/' +_Outfit_+ '/characters?server=genudine&filterOnline=true')
			.end((err, response) => this.setState(Shema.call(this, {outfitsOnlineCountMeta: this.state.outfitsOnlineCountMeta.concat({_Outfit_: _Outfit_, onlineCount: response.body.length})}, true)))
		}
	}
})