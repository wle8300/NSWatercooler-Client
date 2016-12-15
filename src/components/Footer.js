import Router from 'react-router-component'
import React from 'react'
import MUIBottomNavigation from 'material-ui/BottomNavigation/BottomNavigation'
import MUIBottomNavigationItem from 'material-ui/BottomNavigation/BottomNavigationItem'
import MUIPaper from 'material-ui/Paper'
import MUIHomeIcon from 'material-ui/svg-icons/action/home'
import MUIOutfitIcon from 'material-ui/svg-icons/action/group-work'
import MUIPlayerIcon from 'material-ui/svg-icons/social/person'



module.exports = React.createClass({
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any])
	},
	getInitialState: function () {
		return {
			selectedIndex: 0
		}
	},
  render: function () {
    return (
			<MUIPaper style={{position: 'fixed', bottom: 0, width: '100%'}}>
       <MUIBottomNavigation selectedIndex={this.state.selectedIndex} style={{textAlign: 'center'}}>
         <MUIBottomNavigationItem
					 icon={<MUIHomeIcon/>}
					 onTouchTap={() => {this.props.routerRef.navigate('/'); this.select(0)}}>
				 </MUIBottomNavigationItem>
         <MUIBottomNavigationItem
					 icon={<MUIOutfitIcon/>}
					 onTouchTap={() => {this.props.routerRef.navigate('/outfit'); this.select(1)}}>
				 </MUIBottomNavigationItem>
         <MUIBottomNavigationItem
					 icon={<MUIPlayerIcon/>}
					 onTouchTap={() => {this.props.routerRef.navigate('/player'); this.select(2)}}/>
       </MUIBottomNavigation>
     </MUIPaper>
    )
  },
	select: function (idx) {
		this.setState({selectedIndex: idx})
	}
})