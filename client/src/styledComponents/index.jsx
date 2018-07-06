import React from 'react'
import injectSheet from 'react-jss'

const styles = {
  detail: {
    background: '#ffffff',
    padding: '4rem',
    minHeight: '100vh',
    position: 'relative',
  },
}

const Detail = injectSheet(styles)(({ classes, children, style }) => (
  <div className={classes.detail} style={style}>
    {children}
  </div>
))

const a = 1
export { Detail, a }
