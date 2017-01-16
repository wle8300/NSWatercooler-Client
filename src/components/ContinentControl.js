/*
	this component is jacked up.

	can be more cogent.
*/

import env from '../../env'
import Shema from '../../shema'

import React from 'react'
import Request from 'superagent'
import PieChart from 'react-simple-pie-chart'
import SwipeableViews from 'react-swipeable-views'
import MUITab from 'material-ui/Tabs/Tab'
import MUITabs from 'material-ui/Tabs/Tabs'
import MUIAlert from 'material-ui/svg-icons/social/notifications'
import MUIUnlocked from 'material-ui/svg-icons/action/lock-open'
import MUILocked from 'material-ui/svg-icons/action/lock'

module.exports = React.createClass({
	displayName: 'ContinentControl',
	getInitialState: function () {
		return Shema.call(this, {continentControlMetadata: {}, alerts: [], tabIdx: 0})
	},
	render: function () {
		
		const indarTerritoryControl = this._calculateFactionControl('indar') || {}
		const hossinTerritoryControl = this._calculateFactionControl('hossin') || {}
		const amerishTerritoryControl = this._calculateFactionControl('amerish') || {}
		const esamirTerritoryControl = this._calculateFactionControl('esamir') || {}
		
		return (
			<div>
				<MUITabs onChange={this.handleTabIdx}
				  value={this.state.tabIdx}>
				  <MUITab label="Indar" icon={this._deriveIcon('Indar', this.state.alerts, indarTerritoryControl)} value={0}/>
				  <MUITab label="Hossin" icon={this._deriveIcon('Hossin', this.state.alerts, hossinTerritoryControl)} value={1}/>
				  <MUITab label="Amerish" icon={this._deriveIcon('Amerish', this.state.alerts, amerishTerritoryControl)} value={2}/>
				  <MUITab label="Esamir" icon={this._deriveIcon('Esamir', this.state.alerts, esamirTerritoryControl)} value={3}/>
				</MUITabs>
				<SwipeableViews index={this.state.tabIdx}
				  onChangeIndex={this.handleTabIdx}>
					<p style={style1()}>
						<PieChart slices={[
							{
								color: 'gray',
								value: indarTerritoryControl.none || 0
							},
							{
								color: 'purple',
								value: indarTerritoryControl.vs || 0
							},
							{
								color: 'blue',
								value: indarTerritoryControl.nc || 0
							},
							{
								color: 'red',
								value: indarTerritoryControl.tr || 0
							},
						]}/>
					</p>
					<p style={style1()}>
						<PieChart slices={[
							{
								color: 'gray',
								value: hossinTerritoryControl.none || 0
							},
							{
								color: 'purple',
								value: hossinTerritoryControl.vs || 0
							},
							{
								color: 'blue',
								value: hossinTerritoryControl.nc || 0
							},
							{
								color: 'red',
								value: hossinTerritoryControl.tr || 0
							},
						]}/>
					</p>
					<p style={style1()}>
						<PieChart slices={[
							{
								color: 'gray',
								value: amerishTerritoryControl.none || 0
							},
							{
								color: 'purple',
								value: amerishTerritoryControl.vs || 0
							},
							{
								color: 'blue',
								value: amerishTerritoryControl.nc || 0
							},
							{
								color: 'red',
								value: amerishTerritoryControl.tr || 0
							},
						]}/>
					</p>
					<p style={style1()}>
						<PieChart slices={[
							{
								color: 'gray',
								value: esamirTerritoryControl.none || 0
							},
							{
								color: 'purple',
								value: esamirTerritoryControl.vs || 0
							},
							{
								color: 'blue',
								value: esamirTerritoryControl.nc || 0
							},
							{
								color: 'red',
								value: esamirTerritoryControl.tr || 0
							},
						]}/>
					</p>
				</SwipeableViews>
			</div>
		)
	},
	componentDidMount: function () {
		
		this.readContinentControlMetadata()
		this.readAlerts()
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
	_deriveIcon: function (continent, alerts, continentTerritoryControl) {
		
		if (!alerts.length) return null
			
		if (alerts[0].isActive && continent === alerts[0].continent) return <MUIAlert/>
		if (!this._isLocked(continentTerritoryControl)) return <MUIUnlocked/>
		if (this._isLocked(continentTerritoryControl)) return <MUILocked/>
	},
	_isLocked: function (continentTerritoryControl) {
		  
			// 2 or more means locked
			
			const markNone = continentTerritoryControl.none > 0 ? 1 : 0
			const markVS = continentTerritoryControl.vs > 0 ? 1 : 0
			const markNC = continentTerritoryControl.nc > 0 ? 1 : 0
			const markTR = continentTerritoryControl.tr > 0 ? 1 : 0
			
			return markNone + markVS + markNC + markTR <= 2 ? true : false
			
	},
	readContinentControlMetadata: function () {
		
		Request
		.get(env.backend+ '/continent-control-metadata?server=genudine&timeframe=now')
		.end((err, response) => {
			this.setState(Shema.call(this, {continentControlMetadata: response.body}, true))
		})
	},
	readAlerts: function () {
		
		Request
		.get(env.backend+ '/alert?server=genudine&limit=1')
		.end((err, response) => {
			this.setState(Shema.call(this, {alerts: response.body}, true))
		})		
	},
	handleTabIdx: function (idx) {
		this.setState(Shema.call(this, {tabIdx: idx}, true))
	},
})

function style1() {
	return {padding: '2.5rem'}
}