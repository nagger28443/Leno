import React from 'react'
import injectSheet from 'react-jss'

const styles = {
  root: {
    textAlign: 'center',
  },
}

const NoContent = ({ classes }) => <p className={classes.root}>无记录</p>

export default injectSheet(styles)(NoContent)
