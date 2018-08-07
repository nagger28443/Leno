import React from 'react'
import injectSheet from 'react-jss'

const styles = {
  btn: {
    border: props => `1px solid ${props.backgroundColor}`,
    color: props => props.color,
    borderColor: props => props.borderColor,
    backgroundColor: props => props.backgroundColor,
    cursor: 'pointer',
    borderRadius: '0.2rem',
    minWidth: '4rem',
    padding: '0.4rem 0.6rem',
    textAlign: 'center',
    outline: 'none',
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
  classes, style, text, onClick, className, type,
}) => (
  <button className={`${classes.btn} ${className}`} style={style} onClick={onClick} type={type}>
    {text}
  </button>
)

Button.defaultProps = {
  color: '#6c757d',
  borderColor: '#6c757d',
  backgroundColor: '#f5f5f5',
}

export default injectSheet(styles)(Button)
