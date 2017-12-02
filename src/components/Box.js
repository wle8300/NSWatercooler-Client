import React from 'react'
// import PropTypes from 'prop-types'


class Box extends React.Component {
  render() {
    return (
      <div style={this.style()}>
        {this.props.children}
      </div>
    )
  }
  style = () => {
    return Object.assign(
      {},
      {
        display: 'flex'
      },
      this.props.style
    )
  }
}

export default Box