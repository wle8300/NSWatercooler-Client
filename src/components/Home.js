import Request from 'superagent'
import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import MUITab from 'material-ui/Tabs/Tab'
import MUITabs from 'material-ui/Tabs/Tabs'


module.exports = React.createClass({
	propTypes: {
		changeMarquee: React.PropTypes.func.isRequired
	},
	getInitialState: function () {
		return {
			tabIdx: 0
		}
	},
  render: function () {
		
    return (
			<div>
				{/*
					logged in
					? display "ALIAS" of previous week's most dominant outfit
					: register or login button
				*/}
				<MUITabs onChange={this.handleTabIdx}
				  value={this.state.tabIdx}>
				  <MUITab label="Login" value={0}/>
				  <MUITab label="Signup" value={1}/>
				</MUITabs>
				<SwipeableViews index={this.state.tabIdx}
				  onChangeIndex={this.handleTabIdx}>
				  <div>
						hey 1
				  </div>
				  <div>
				    hey 2
				  </div>
				</SwipeableViews>
			</div>
    )
  },
	componentWillMount: function () {
		
		this.props.changeMarquee('Home')
	},
	handleTabIdx: function (idx) {
		this.setState({tabIdx: idx})
	}
})