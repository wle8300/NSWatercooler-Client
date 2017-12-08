import OnlineStatus from './OnlineStatus'
import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import Box from './Box'
import Bloom from 'react-bloom'

import React from 'react'
// import PropTypes from 'prop-types'

class ListItemCharacter extends React.Component {
  render() {
    return (
      <div
        onTouchTap={this.props.onTouchTap}
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '4.3rem',
          overflow: 'hidden',
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
        <Bloom bloomSize={200} backgroundColor="black" opacity={0.25}/>
      </div>
    )
  }
}

export default ListItemCharacter
