// import Router from 'react-router-component'
import React from 'react'
import MUIBottomNavigation from 'material-ui/BottomNavigation/BottomNavigation'
import MUIBottomNavigationItem from 'material-ui/BottomNavigation/BottomNavigationItem'
import MUIPaper from 'material-ui/Paper'
import MUIHomeIcon from 'material-ui/svg-icons/action/home'
import MUIOutfitIcon from 'material-ui/svg-icons/action/group-work'
import MUICharacterIcon from 'material-ui/svg-icons/social/person'
import MUINavBackArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import MUINavForwardArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right'



module.exports = React.createClass({
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		arePageButtonsVisible: React.PropTypes.bool.isRequired
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
				  icon={<MUINavBackArrow/>}
				  onTouchTap={() => {window.history.back()}}/>
		     <MUIBottomNavigationItem
				  icon={<MUIHomeIcon/>}
				  onTouchTap={() => {this.props.routerRef.navigate('/'); this.select(1)}}
					style={style1(this.props)}/>
         <MUIBottomNavigationItem
					 icon={<MUIOutfitIcon/>}
					 onTouchTap={() => {this.props.routerRef.navigate('/outfit'); this.select(2)}}
 					 style={style1(this.props)}/>
         <MUIBottomNavigationItem
					 icon={<MUICharacterIcon/>}
					 onTouchTap={() => {this.props.routerRef.navigate('/character'); this.select(3)}}
					 style={style1(this.props)}/>
 		     <MUIBottomNavigationItem
 				  icon={<MUINavForwardArrow/>}
 				  onTouchTap={() => {window.history.forward()}}/>
       </MUIBottomNavigation>
     </MUIPaper>
    )
  },
	componentDidUpdate: function (prevProps, prevState) {

		if (location.pathname.match(/^\/$/) && this.state.selectedIndex !== 1) return this.select(1)
		if (location.pathname.match(/\/outfit(\/.+)?/ig) && this.state.selectedIndex !== 2) return this.select(2)
		if (location.pathname.match(/\/character(\/.+)?/ig) && this.state.selectedIndex !== 3) return this.select(3)
	},
	select: function (idx) {
		this.setState({selectedIndex: idx})
	}
})

function style1(props, state) {
	return {display: props.arePageButtonsVisible ? 'inherit' : 'none'}
}