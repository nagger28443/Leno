import { React, injectSheet,inject, observer, get } from 'src/commonExports' //eslint-disable-line

const styles = {
  root: {
    width: '15%',
    maxWidth: '16rem',
    minWidth: '12rem',
    background: '#fff',
  },
}

class Leftbar extends React.Component {
  componentDidMount() {}
  render() {
    const { classes } = this.props
    return <sider className={classes.root}>leftbar</sider>
  }
}

export default injectSheet(styles)(Leftbar)
