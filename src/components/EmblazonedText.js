import React from 'react'
// import PropTypes from 'prop-types'


class EmblazonedText extends React.Component {
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
        position: 'fixed',
        width: '100vw',
        fontSize: '59vw',
        fontStyle: 'italic',
        color: '#f5f5f5',
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
        transform: 'rotateZ(90deg) translateY(-29vw) translateX(34vw)',
        lineHeight: 0,
        letterSpacing: '0.5rem',
      },
      this.props.style
    )
  }
}

export default EmblazonedText