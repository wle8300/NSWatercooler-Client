import env from '../../env'
import Shema from '../../shema'

import React from 'react'
import Request from 'superagent'
import PieChart from 'react-simple-pie-chart'
import SwipeableViews from 'react-swipeable-views'
import MUITab from 'material-ui/Tabs/Tab'
import MUITabs from 'material-ui/Tabs/Tabs'


module.exports = React.createClass({
	displayName: 'ContinentControl',
	getInitialState: function () {
		return Shema.call(this, {continentControlMetadata: {}, tabIdx: 0})
	},
	render: function () {
		
		const indarMetadata = this._calculateFactionControl('indar') || {}
		const hossinMetadata = this._calculateFactionControl('hossin') || {}
		const amerishMetadata = this._calculateFactionControl('amerish') || {}
		const esamirMetadata = this._calculateFactionControl('esamir') || {}
		
		return (
			<div>
				<MUITabs onChange={this.handleTabIdx}
				  value={this.state.tabIdx}>
				  <MUITab label="Indar" value={0}/>
				  <MUITab label="Hossin" value={1}/>
				  <MUITab label="Amerish" value={2}/>
				  <MUITab label="Esamir" value={3}/>
				</MUITabs>
				<SwipeableViews index={this.state.tabIdx}
				  onChangeIndex={this.handleTabIdx}>
					<p style={style1()}>
						<PieChart slices={[
							{
								color: 'gray',
								value: indarMetadata.none || 0
							},
							{
								color: 'purple',
								value: indarMetadata.vs || 0
							},
							{
								color: 'blue',
								value: indarMetadata.nc || 0
							},
							{
								color: 'red',
								value: indarMetadata.tr || 0
							},
						]}/>
					</p>
					<p style={style1()}>
						<PieChart slices={[
							{
								color: 'gray',
								value: hossinMetadata.none || 0
							},
							{
								color: 'purple',
								value: hossinMetadata.vs || 0
							},
							{
								color: 'blue',
								value: hossinMetadata.nc || 0
							},
							{
								color: 'red',
								value: hossinMetadata.tr || 0
							},
						]}/>
					</p>
					<p style={style1()}>
						<PieChart slices={[
							{
								color: 'gray',
								value: amerishMetadata.none || 0
							},
							{
								color: 'purple',
								value: amerishMetadata.vs || 0
							},
							{
								color: 'blue',
								value: amerishMetadata.nc || 0
							},
							{
								color: 'red',
								value: amerishMetadata.tr || 0
							},
						]}/>
					</p>
					<p style={style1()}>
						<PieChart slices={[
							{
								color: 'gray',
								value: esamirMetadata.none || 0
							},
							{
								color: 'purple',
								value: esamirMetadata.vs || 0
							},
							{
								color: 'blue',
								value: esamirMetadata.nc || 0
							},
							{
								color: 'red',
								value: esamirMetadata.tr || 0
							},
						]}/>
					</p>
				</SwipeableViews>
			</div>
		)
	},
	componentDidMount: function () {
		
		this.readContinentControlMetadata()
	},
	_calculateFactionControl: function (continent) {
	  
		if (!this.state.continentControlMetadata.continents) return null
		
		if (continent === 'indar') {
				return {
					none: this.state.continentControlMetadata.continents[0].control[0],
					vs: this.state.continentControlMetadata.continents[0].control[1],
					nc: this.state.continentControlMetadata.continents[0].control[2],
					tr: this.state.continentControlMetadata.continents[0].control[3]
				}
		}
		if (continent === 'hossin') {
				return {
					none: this.state.continentControlMetadata.continents[1].control[0],
					vs: this.state.continentControlMetadata.continents[1].control[1],
					nc: this.state.continentControlMetadata.continents[1].control[2],
					tr: this.state.continentControlMetadata.continents[1].control[3]
				}
		}
		if (continent === 'amerish') {
				return {
					none: this.state.continentControlMetadata.continents[2].control[0],
					vs: this.state.continentControlMetadata.continents[2].control[1],
					nc: this.state.continentControlMetadata.continents[2].control[2],
					tr: this.state.continentControlMetadata.continents[2].control[3]
				}
		}
		if (continent === 'esamir') {
				return {
					none: this.state.continentControlMetadata.continents[3].control[0],
					vs: this.state.continentControlMetadata.continents[3].control[1],
					nc: this.state.continentControlMetadata.continents[3].control[2],
					tr: this.state.continentControlMetadata.continents[3].control[3]
				}
		}
	},
	readContinentControlMetadata: function () {
		
		Request
		.get(env.backend+ '/continent-control-metadata?server=genudine&timeframe=now')
		.end((err, response) => {
			
			this.setState(Shema.call(this, {continentControlMetadata: response.body}, true))
		})
	},
	handleTabIdx: function (idx) {

		this.setState(Shema.call(this, {tabIdx: idx}, true))
	},
})

function style1() {
	return {padding: '2.5rem'}
}