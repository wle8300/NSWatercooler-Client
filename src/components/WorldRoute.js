import env from '../../env'
import Shema from '../../shema'
import size from '../size'
import color from '../color'

import ContinentControl from './ContinentControl'

import _ from 'lodash'
import React from 'react'
import Request from 'superagent'


module.exports = React.createClass({
	displayName: 'WorldRoute',
	propTypes: {
		changeMarquee: React.PropTypes.func.isRequired,
		changeFaction: React.PropTypes.func.isRequired,
		changeFooter: React.PropTypes.func.isRequired,
	},
	getInitialState: function () {
		return Shema.call(this, {census: {}})
	},
  render: function () {

		const PopulationNow = (() => {

			if (!Object.keys(this.state.census).length) return null

			const totalCount = this.state.census.vs + this.state.census.nc + this.state.census.tr
			const vsCount = this.state.census.vs
			const ncCount = this.state.census.nc
			const trCount = this.state.census.tr
			const vsPercentage = parseInt(100 * (vsCount / totalCount), 10)+ '%'
			const ncPercentage = parseInt(100 * (ncCount / totalCount), 10)+ '%'
			const trPercentage = parseInt(100 * (trCount / totalCount), 10)+ '%'
			const style1 = function () {
				return {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '3rem',
					textAlign: 'center',
					fontSize: '0.9rem'
				}
			}

			return (
				<div style={{
					padding : '0.25rem 1.5rem 1rem',
					backgroundColor : color.ns.standard,
				}}>
					<div style={{display: 'flex', width: '100%', color: 'white'}}>
						<div style={_.assign(style1(), {width: vsPercentage, backgroundColor: 'purple'})}>{vsCount}</div>
						<div style={_.assign(style1(), {width: ncPercentage, backgroundColor: 'blue'})}>{ncCount}</div>
						<div style={_.assign(style1(), {width: trPercentage, backgroundColor: 'red'})}>{trCount}</div>
					</div>
					<div style={{padding: '1rem 0 0', width: '100%', color: 'white', textAlign: 'center', fontSize: '0.9rem'}}>
						{totalCount+ ' Planetmans'}
					</div>
				</div>
			)
		})()

    return (
			<div style={{
				marginTop: `${size.headerHeight}rem`,
				height: `calc(100vh - ${size.headerHeight + size.footerHeight}rem)`,
			}}>
				{PopulationNow}
				<ContinentControl/>
			</div>
    )
  },
	componentWillMount: function () {
		this.props.changeMarquee('World')
		this.props.changeFaction('ns')
		this.props.changeFooter(true)
	},
	componentDidMount: function () {

		this.readCensus()
	},
	readCensus: function () {

		Request
		.get(env.backend+ '/census?server=genudine&timeframe=now')
		.end((err, response) => {

			this.setState(Shema.call(this, {census: response.body}, true))
		})
	}
})