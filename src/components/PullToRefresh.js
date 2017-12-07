import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'


class PullToRefresh extends React.Component {
  constructor(props) {

    super(props)

    this.state = {
      yPosition: 0,
      isRefreshing: false,
      isLocked: false,
    }
  }
  render() {

    return (
      <div style={{
        // height: '100vh',
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
          {this.getLoadingImg()}
        </div>


        <Draggable
          axis="y"
          disabled={!this.props.isEnabled}
          bounds={{top: 0}}
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

    console.log('ui', ui);

    // if direction is down && top of list then enable

    this.setState((prevState) => {

      const yPosition = prevState.yPosition + ui.deltaY

      if (!prevState.isLocked) return {
        yPosition: yPosition,
      }
    })
  }

  handleDragStop = () => {

    const isRefreshHandlerEngaged = this.state.yPosition >= this.props.threshold
    const yPosition = isRefreshHandlerEngaged ? this.props.threshold : 0

    this.setState({
      yPosition: yPosition,
      isLocked: isRefreshHandlerEngaged,
      isRefreshing: isRefreshHandlerEngaged,
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
  isEnabled: true,
  threshold: 100,
}

export default PullToRefresh