import React from 'react'
import PropTypes from 'prop-types'


class ProgressBar extends React.Component {
  render() {
    return (
      <div style={{
        width: '100%',
        display: 'flex',
      }}>
        <div style={this.style()}>
          {this.props.shouldDisplayPercent ? `${this.props.percent}%` : null}
        </div>
      </div>
    )
  }
  style = () => {
    return Object.assign(
      {},
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: `${this.props.percent}%`,
        backgroundColor: this.props.color || 'black',
      },
      this.props.style
    )
  }
}

ProgressBar.propTypes = {
  isLoading: PropTypes.bool,
  percent: PropTypes.number,
  backgroundColor: PropTypes.string,
}

export default ProgressBar