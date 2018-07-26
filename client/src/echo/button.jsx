import React from 'react'
import injectSheet from 'react-jss'

const styles = {
  container: {
    border: props => `1px solid ${props.backgroundColor}`,
    color: props => props.color,
    borderColor: props => props.borderColor,
    borderRadius: '0.2rem',
    minWidth: '4rem',
    padding: '0.4rem 0.6rem',
    textAlign: 'center',
    '&:hover': {
      backgroundColor: props => props.color,
      color: props => props.backgroundColor,
    },
    '&:active': {
      boxShadow: props => `0 0 1px 1px ${props.borderColor}`,
    },
  },
}

const Button = ({
  classes, style, text, onClick, className,
}) => (
  <div className={`plain-link ${classes.container} ${className}`} style={style} onClick={onClick}>
    <span>{text}</span>
  </div>
)

Button.defaultProps = {
  color: '#555',
  borderColor: '#6c757d',
  backgroundColor: '#fff',
}

export default injectSheet(styles)(Button)
