import OnlineStatus from './OnlineStatus'
import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import Box from './Box'

import React from 'react'
// import PropTypes from 'prop-types'

class ListItemCharacter extends React.Component {
  constructor (props) {

    super(props)

    this.state = {
      isPressed: false
    }
  }
  render() {
    return (
      <div
        onTouchTap={this.props.onTouchTap}
        onTouchStart={() => this.setState({isPressed: true})}
        onTouchCancel={() => this.setState({isPressed: false})}
        onTouchMove={() => this.setState({isPressed: false})}
        onTouchEnd={() => this.setState({isPressed: false})}

        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '4.3rem',
          overflow: 'hidden',
          backgroundColor: this.state.isPressed ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
          transition: 'background-color 350ms linear',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Box
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              width: '100%',
              height: '100%',
            }}
          >
            <Box>
              <Box style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '1rem',
              }}>
                <OnlineStatus isOnline={this.props.characterOnlineStatus ? this.props.characterOnlineStatus.isOnline : false} isLoading={!this.props.characterOnlineStatus ? true : false}/>
              </Box>
              {this.props.characterName}
              <br/>
              {this.props.characterLastLogin}
            </Box>
            <div><MUIArrowRight/></div>
          </Box>
        </Box>
      </div>
    )
  }
}

export default ListItemCharacter
