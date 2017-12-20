import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import Box from './Box'
import Bloom from 'react-bloom'
import React from 'react'
// import PropTypes from 'prop-types'


class ListItemOutfit extends React.Component {
  constructor() {

    super()

    this.state = {
      isPressed: false,
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
          backgroundColor: this.state.isPressed ? 'rgba(0, 0, 0, 0.25)' : 'transparent',
          transition: 'background-color 250ms linear',
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
      </div>
    )
  }
  // render() {
  //   return (
  //     <div
  //       onTouchTap={this.props.onTouchTap}
  //       style={{
  //         position: 'relative',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         height: '4.3rem',
  //         overflow: 'hidden',
  //       }}
  //     >
  //       <Box
  //         style={{
  //           position: 'absolute',
  //           top: 0,
  //           left: 0,
  //           justifyContent: 'space-between',
  //           alignItems: 'center',
  //           width: '100%',
  //           height: '100%',
  //         }}
  //       >
  //         <Box
  //           style={{
  //             justifyContent: 'space-between',
  //             alignItems: 'center',
  //             padding: '1rem',
  //             width: '100%',
  //             height: '100%',
  //           }}
  //         >
  //           <div>
  //             {this.props.outfitAlias}
  //             <br/>
  //             {
  //               this.props.outfitOnlineCount
  //                 ? this.props.outfitOnlineCount.onlineCount + ' online'
  //                 : 'Loading...'
  //             }
  //           </div>
  //           <div><MUIArrowRight/></div>
  //         </Box>
  //       </Box>
  //       <Bloom bloomSize={200} backgroundColor="rgba(0, 0, 0, 0.1)"/>
  //     </div>
  //   )
  // }
}

export default ListItemOutfit
