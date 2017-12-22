import color from '../color'

import React from 'react'
import MUIAppBar from 'material-ui/AppBar';
import size from '../size'

module.exports = React.createClass({
	propTypes: {
		marquee: React.PropTypes.object.isRequired,
		faction: React.PropTypes.string.isRequired,
		isLoading: React.PropTypes.bool.isRequired,
		toggleDrawer: React.PropTypes.func.isRequired
	},
	_loaderInterval: null,
	getInitialState: function () {
		return {
			isBrighter: false,
		}
	},
	render: function () {

		if (!this.props.isLoading) this.wipeAndNullifyInterval()
		if (this.props.isLoading && !this._loaderInterval) this._loaderInterval = setInterval(() => {

			this.setState({isBrighter: !this.state.isBrighter})
		}, 500)

		return (
				<div style={{
					position: 'fixed',
					zIndex: 1,
					top: 0,
					width: '100%',
					height: `${size.headerHeight}rem`,
					backgroundColor: color[this.props.faction].standard,
					padding: '0 1rem',
					display: 'flex',
					alignItems: 'center',
					fontSize: '1.56rem',
					color: 'white',
					filter: `brightness(${this.state.isBrighter && this.props.isLoading ? '150%' : '100%'})`,
					transition: 'background-color 350ms linear, filter 500ms linear',
				}}>
					<div>{this.props.marquee.message}</div>
					<div><small style={{marginLeft: '0.4rem', fontSize: '0.75rem', opacity: 0.5}}>GENUDINE</small></div>
				</div>
		)
	},
	wipeAndNullifyInterval: function () {

		clearInterval(this._loaderInterval)
		this._loaderInterval = null
	}
})
