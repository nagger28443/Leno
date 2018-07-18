import { React, injectSheet,inject, observer, get } from 'src/commonExports' //eslint-disable-line

const styles = {
  root: {},
  content: {
    width: '80vw',
    minWidth: '60rem',
    maxWidth: '100rem',
    margin: 'auto',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {},
  right: {},
}

class Topbar extends React.Component {
  componentDidMount() {}
  render() {
    const { classes, clazz } = this.props
    return (
      <header className={`${classes.root} ${clazz}`}>
        <div className={classes.content}>
          <span className={classes.left}>管理中心</span>
          <div className={classes.right}>
            <span>Greetings!</span>
            <span className="plain-link">退出</span>
          </div>
        </div>
      </header>
    )
  }
}

export default injectSheet(styles)(Topbar)
