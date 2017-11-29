import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'


class PullToRefresh extends React.Component {
  constructor(props) {

    super(props)

    this.state = {
      isLocked: false,
      isRefreshing: false,
      yPosition: 0,
    }
  }
  render() {

    return (
      <div style={{
        height: '100%',
        // overflow: 'hidden',
      }}>


        <div style={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: this.state.yPosition,
          overflow: 'hidden',
          // backgroundColor: 'gray',
        }}>
          {/* {this.state.yPosition} | {!this.state.isRefreshing ? "😗" : "😘"} */}
          {this.getLoadingImg()}
        </div>


        <Draggable
          axis="y"
          position={{
            x: 0,
            y: this.calcYAnchor(),
          }}
          onDrag={this.handleDrag}
          onStop={this.handleDragStop}
        >
          {this.props.children}
        </Draggable>


      </div>
    )
  }

  calcYAnchor = () => {

    if (this.state.isLocked && this.state.yPosition <= 0) return 0
    if (this.state.isLocked && this.state.yPosition >= this.props.threshold) return this.props.threshold
    else return this.state.yPosition
  }

  getLoadingImg = () => {

    if (this.state.yPosition < this.props.threshold) return "😅"
    if (!this.state.isRefreshing && this.state.yPosition >= this.props.threshold) return "😙"
    if (this.state.isRefreshing) return "😘"
  }

  handleDrag = (e, ui) => {

    this.setState((prevState) => {

      const yPosition = prevState.yPosition + ui.deltaY

      if (!prevState.isLocked) return { yPosition: yPosition, }
    })
  }

  handleDragStop = () => {

    const isRefreshHandlerEngaged = this.state.yPosition >= this.props.threshold
    const yPosition = isRefreshHandlerEngaged ? this.props.threshold : 0

    this.setState({
      isLocked: isRefreshHandlerEngaged,
      isRefreshing: isRefreshHandlerEngaged,
      yPosition: yPosition,
    }, () => {

      if (isRefreshHandlerEngaged) {

        this.props.refreshHandler()
        .then(this.resetState)
      }
    })
  }

  resetState = () => {

    this.setState({
      isLocked: false,
      isRefreshing: false,
      yPosition: 0,
    })
  }
}


PullToRefresh.propTypes = {
  threshold: PropTypes.number,
  refreshHandler: PropTypes.func.isRequired,
}

PullToRefresh.defaultProps = {
  threshold: 100,
}

export default PullToRefresh