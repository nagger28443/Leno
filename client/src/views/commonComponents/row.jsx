import React from 'react'
import injectSheet from 'react-jss'

const styles = {
  row: {
    margin: '1rem',
  },
}
const Row = ({ classes }) => <div className={classes.row} />
export default injectSheet(styles)(Row)
