import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import Box from './Box'

import React from 'react'
// import PropTypes from 'prop-types'

class OutfitCharacter extends React.Component {
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '4.3rem',
          overflow: 'hidden',
          backgroundColor: this.state.isPressed ? 'rgba(0, 0, 0, 0.25)' : 'transparent',
          transition: 'background-color 250ms linear',
        }}
      >
        <Box
          style={{
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
              <div>{this.props.characterName}</div>
              <div style={{fontSize: '0.8rem', color: 'gray',}}>{this.props.characterLastLogin}</div>
            </div>
            <div><MUIArrowRight/></div>
          </Box>
        </Box>
      </div>
    )
  }
}

export default OutfitCharacter
