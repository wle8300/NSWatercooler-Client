/*
	this component is jacked up.

	can be more cogent.
*/

import env from '../../env'
import Shema from '../../shema'
import color from '../color'

import React from 'react'
import Request from 'superagent'
import PieChart from 'react-simple-pie-chart'
import SwipeableViews from 'react-swipeable-views'
import MUITab from 'material-ui/Tabs/Tab'
import MUITabs from 'material-ui/Tabs/Tabs'
import MUIAlert from 'material-ui/svg-icons/social/notifications'
import MUIUnlocked from 'material-ui/svg-icons/action/lock-open'
import MUILocked from 'material-ui/svg-icons/action/lock'
import Box from './Box'


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
				<MUITabs
					onChange={this.handleTabIdx}
				  value={this.state.tabIdx}
					inkBarStyle={{marginTop: -5, height: 5}}>
				  <MUITab label="Indar" icon={this._getIcon('Indar', this.state.alert, indarTerritoryControl)} value={0}/>
				  <MUITab label="Hossin" icon={this._getIcon('Hossin', this.state.alert, hossinTerritoryControl)} value={1}/>
				  <MUITab label="Amerish" icon={this._getIcon('Amerish', this.state.alert, amerishTerritoryControl)} value={2}/>
				  <MUITab label="Esamir" icon={this._getIcon('Esamir', this.state.alert, esamirTerritoryControl)} value={3}/>
				</MUITabs>
				<SwipeableViews
					index={this.state.tabIdx}
				  onChangeIndex={this.handleTabIdx}
					style={{marginTop: '7.5vw'}}>
					<Box style={{
						justifyContent: 'center',
						alignItems: 'center',
					}}>
						<div style={{
							width: '85%',
						}}>

							<PieChart slices={[
								{
									color: 'gray',
									value: indarTerritoryControl.none || 0
								},
								{
									color: color.vs.standard,
									value: indarTerritoryControl.vs || 0
								},
								{
									color: color.nc.standard,
									value: indarTerritoryControl.nc || 0
								},
								{
									color: color.tr.standard,
									value: indarTerritoryControl.tr || 0
								},
							]}/>
						</div>
					</Box>
					<Box style={{
						justifyContent: 'center',
						alignItems: 'center',
					}}>
						<div style={{
							width: '85%',
						}}>

							<PieChart slices={[
								{
									color: 'gray',
									value: hossinTerritoryControl.none || 0
								},
								{
									color: color.vs.standard,
									value: hossinTerritoryControl.vs || 0
								},
								{
									color: color.nc.standard,
									value: hossinTerritoryControl.nc || 0
								},
								{
									color: color.tr.standard,
									value: hossinTerritoryControl.tr || 0
								},
							]}/>
						</div>
					</Box>
					<Box style={{
						justifyContent: 'center',
						alignItems: 'center',
					}}>
						<div style={{
							width: '85%',
						}}>
							<PieChart slices={[
								{
									color: 'gray',
									value: amerishTerritoryControl.none || 0
								},
								{
									color: color.vs.standard,
									value: amerishTerritoryControl.vs || 0
								},
								{
									color: color.nc.standard,
									value: amerishTerritoryControl.nc || 0
								},
								{
									color: color.tr.standard,
									value: amerishTerritoryControl.tr || 0
								},
							]}/>
						</div>
					</Box>
					<Box style={{
						justifyContent: 'center',
						alignItems: 'center',
					}}>
						<div style={{
							width: '85%',
						}}>

							<PieChart slices={[
								{
									color: 'gray',
									value: esamirTerritoryControl.none || 0
								},
								{
									color: color.vs.standard,
									value: esamirTerritoryControl.vs || 0
								},
								{
									color: color.nc.standard,
									value: esamirTerritoryControl.nc || 0
								},
								{
									color: color.tr.standard,
									value: esamirTerritoryControl.tr || 0
								},
							]}/>
						</div>
					</Box>
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
	_getIcon: function (continent, alert, continentTerritoryControl) {

		if (alert && alert.metagame_event_state_name === 'started') {

			if (continent === 'Indar' && alert.metagame_event_id === "1") return <MUIAlert/>
			if (continent === 'Esamir' && alert.metagame_event_id === "2") return <MUIAlert/>
			if (continent === 'Amerish' && alert.metagame_event_id === "3") return <MUIAlert/>
			if (continent === 'Hossin' && alert.metagame_event_id === "4") return <MUIAlert/>
		}

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
			this.setState(Shema.call(this, {alert: response.body[0]}, true))
		})
	},
	handleTabIdx: function (idx) {
		this.setState(Shema.call(this, {tabIdx: idx}, true))
	},
})