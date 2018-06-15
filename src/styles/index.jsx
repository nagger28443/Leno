import React from 'react'
import injectSheet from 'react-jss'

const styles = {
  detail: {
    background: '#ffffff',
    padding: '3rem',
    minHeight: '100vh',
  },
}

const Detail = injectSheet(styles)(({ classes, children }) => (
  <div className={classes.detail}>{children}</div>
))

const a = 1
export { Detail, a }
