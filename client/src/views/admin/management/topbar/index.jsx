import { React, injectSheet,inject, observer, get } from 'src/commonExports' //eslint-disable-line

const styles = {
  root: {
    height: '4rem',
    background: '#fff',
  },
  content: {
    maxWidth: '100rem',
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
}

class Topbar extends React.Component {
  componentDidMount() {}
  render() {
    const { classes } = this.props
    return (
      <header className={classes.root}>
        <div className={classes.content}>
          <span>topbar</span>
        </div>
      </header>
    )
  }
}

export default injectSheet(styles)(Topbar)
