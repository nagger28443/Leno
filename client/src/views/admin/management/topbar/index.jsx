import {
  React, injectSheet, Link,
} from 'src/commonExports'
import { Button } from 'src/echo'

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
            <Button
              text={<Link to="/admin/blog/edit/new" className="plain-link">写博客</Link>}
              style={{ marginRight: 15 }}
            />
            <span>Greetings!</span>
            <span className="plain-link">退出</span>
          </div>
        </div>
      </header>
    )
  }
}

export default injectSheet(styles)(Topbar)
