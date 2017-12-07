import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import Box from './Box'
import Bloom from 'react-bloom'
import React from 'react'
// import PropTypes from 'prop-types'


class ListItemOutfit extends React.Component {
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
            justifyContent: 'space-between',
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
            <div>
              {this.props.outfitAlias}
              <br/>
              {
                this.props.outfitOnlineCount
                  ? this.props.outfitOnlineCount.onlineCount + ' online'
                  : 'Loading...'
              }
            </div>
            <div><MUIArrowRight/></div>
          </Box>
        </Box>
        <Bloom bloomSize={200} backgroundColor="rgba(0, 0, 0, 0.1)"/>
      </div>
    )
  }
}

export default ListItemOutfit
