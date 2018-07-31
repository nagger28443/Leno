import {
  React, injectSheet, Link, withRouter,
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

class TopBar extends React.Component {
  componentDidMount() {}

  logOut= () => {
    window.sessionStorage.removeItem('token')
    window.location.href = '/admin/login'
  }

  newPost = () => {
    this.props.history.push('/admin/blog/edit/new')
  }

  render() {
    const { classes, clazz } = this.props
    return (
      <header className={`${classes.root} ${clazz}`}>
        <div className={classes.content}>
          <span className={classes.left}>Console</span>
          <div className={classes.right}>
            <Button
              text={<Link to="/admin/blog/edit/new" className="plain-link">New post</Link>}
              onClick={this.newPost}
              style={{ marginRight: 15 }}
            />
            <span>Greetings!</span>
            <span className="link" onClick={this.logOut} style={{ margin: '0 1rem' }}>Sign out</span>
          </div>
        </div>
      </header>
    )
  }
}

export default withRouter(injectSheet(styles)(TopBar))
