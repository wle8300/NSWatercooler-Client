// import Request from 'superagent'
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
				<MUITabs onChange={this.handleTabIdx}
				  value={this.state.tabIdx}>
				  <MUITab label="Saved" value={0}/>
				  <MUITab label="Messages" value={1}/>
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
		
		this.props.changeMarquee('Player')
	},
	handleTabIdx: function (idx) {
		this.setState({tabIdx: idx})
	}
})