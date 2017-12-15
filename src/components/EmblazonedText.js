import React from 'react'
// import PropTypes from 'prop-types'


class EmblazonedText extends React.Component {
  render() {
    return (
      <div
        style={{
          position: 'fixed',
          width: '100vw',
          fontSize: '59vw',
          fontStyle: 'italic',
          color: '#f5f5f5',
          fontWeight: 'bold',
          fontFamily: 'Helvetica',
          transform: 'rotateZ(90deg) translateY(-29vw) translateX(34vw)',
          lineHeight: 0,
        }}
      >
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

export default EmblazonedText