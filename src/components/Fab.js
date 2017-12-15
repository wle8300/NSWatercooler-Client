import React from 'react'
import PropTypes from 'prop-types'

class Fab extends React.Component {
  render() {
    return (
      <div onTouchTap={this.props.onTouchTap} style={this.style()}>
        {this.props.children}
      </div>
    )
  }
  style = () => {
    return Object.assign({}, {
      zIndex: 2,
      position: 'fixed',
      right: '1.5rem',
      bottom: '5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '3.5rem',
      height: '3.5rem',
      backgroundColor: 'gray',
      borderRadius: '3.5rem'
    }, this.props.style)
  }
}

Fab.propTypes = {
  onTouchTap: PropTypes.func.isRequired,
}

export default Fab