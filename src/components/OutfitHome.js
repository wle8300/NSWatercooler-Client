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
import MUIList from 'material-ui/List/List'
import MUIListItem from 'material-ui/List/ListItem'
import MUITextField from 'material-ui/TextField'
import MUIRaisedButton from 'material-ui/RaisedButton'
// import MUISubheader from 'material-ui/Subheader'
// import PullToRefresh from './PullToRefresh'
import ListItemOutfit from './ListItemOutfit'
import size from '../size'

module.exports = React.createClass({
	displayName: 'OutfitHome',
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		changeMarquee: React.PropTypes.func.isRequired
	},
	_list: null,
	getInitialState: function () {
		return Shema.call(this, {
			scrollPosition: 0,
			scrollDirection: null,
			outfitsSearchTerm: '',
			outfitsSearchResults: [],
			outfitBookmarks: [],
			outfits: [],
			outfitsOnlineCount: []
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
				{/* <PullToRefresh
					isEnabled={this.state.scrollPosition < 0 && this.state.scrollDirection === 'up'}
					refreshHandler={this.refreshHandler}
				> */}
				<MUIList
					style={{
						// marginTop: `${size.formHeight}rem`,
						padding: 0,
						height: `calc(100vh - ${size.headerHeight + size.footerHeight}rem)`,
					}}
				>
					{this.state.outfitBookmarks.map((outfitBookmark) => {

							// const outfit = this.state.outfits.filter((outfit) => outfit.id === outfitBookmark._Outfit_)[0]
						const outfitOnlineCount = this.state.outfitsOnlineCount.filter((outfitOnlineCount) => outfitOnlineCount._Outfit_ === outfitBookmark._Outfit_)[0]
						// {
						//   _Outfit_: [String object],
						//   onlineCount: [Number object]
						// }


						return (
							<VisibilitySensor
								key={outfitBookmark.id}
								onChange={(isVisible) => {
									this.readOutfit(outfitBookmark._Outfit_, isVisible)
									this.readOutfitOnlineMembers(outfitBookmark._Outfit_, isVisible)
								}}>
								<ListItemOutfit
									onTouchTap={() => this.props.routerRef.navigate('/outfit/' +outfitBookmark._Outfit_)}
									outfitAlias={outfitBookmark.outfitAlias}
									outfitOnlineCount={outfitOnlineCount}
									/>
								</VisibilitySensor>
							)
						})}
					</MUIList>
					{/* </PullToRefresh> */}
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

		const searchTermLowerCased = this.state.outfitsSearchTerm.toLowerCase()

		Request
		.get(env.backend+ '/outfit?server=genudine&search=' +searchTermLowerCased)
		.end((err, response) => {

			if (err) throw err

			this.setState(Shema.call(this, {outfitsSearchResults: response.body}, true))
		})
	},
	readOutfitBookmarks: function () {

		return new Promise((resolve, reject) => {

			Request
			.get(env.backend+ '/user/' +utils.parseJwtPayload().id+ '/outfit-bookmarks')
			.set({Authorization: 'Bearer ' +utils.parseJwt()})
			.end((err, response) => {

				this.setState(Shema.call(this, {
					outfitBookmarks: response.body
				}, true), resolve)
			})
		})
	},
	readOutfit: function (_Outfit_, isVisible) {

		// const isOutfitLoaded = !!this.state.outfits.filter((outfit) => outfit.outfit_id === _Outfit_).length

		// if (isVisible && !isOutfitLoaded) {
		if (isVisible) {

			Request
			.get(env.backend+ '/outfit/' +_Outfit_+ '?server=genudine')
			.end((err, response) => {

				const outfitsUpdated = this.state.outfits.filter((outfit) => {
					return outfit.outfit_id !== _Outfit_
				}).concat(response.body)


				this.setState(Shema.call(this, {outfits: outfitsUpdated}, true))
			})
		}
	},
	readOutfitOnlineMembers: function (_Outfit_, isVisible) {

		// const isOutfitOnlineCountLoaded = !!this.state.outfitsOnlineCount.filter((outfitOnlineCount) => outfitOnlineCount._Outfit_ === _Outfit_).length

		// if (isVisible && !isOutfitOnlineCountLoaded) {

		if (isVisible) {

			Request
			.get(env.backend+ '/outfit/' +_Outfit_+ '/characters?server=genudine&filterOnline=true')
			.end((err, response) => {

				const outfitsOnlineCountUpdated = this.state.outfitsOnlineCount.filter((el) => el._Outfit_ !== _Outfit_).concat({_Outfit_: _Outfit_, onlineCount: response.body.length})


				return this.setState(
					Shema.call(
						this,
						{
							outfitsOnlineCount: outfitsOnlineCountUpdated
						},
						true
					)
				)
			})
		}
	}
})