import { React, injectSheet } from 'src/commonExports'
import { Switch, Route } from 'react-router-dom'
import Topbar from './topbar'
import Leftbar from './leftbar'
import BlogEditor from './blog/blogEditor'
import BlogList from './blog/blogList'
import Category from './category'
import Settings from './settings'
import Statistics from './statistics'

const styles = {
  root: {
    width: '100%',
    minHeight: '100vh',
  },
  bottom: {
    margin: 'auto',
    marginBottom: '5rem',
    display: 'flex',
    justifyContent: 'center',
    width: '80vw',
    minWidth: '60rem',
    maxWidth: '100rem',
    minHeight: '40rem',
    marginTop: '1.2rem',
  },
  content: {
    flex: 1,
    background: '#fff',
    marginLeft: '0.2rem',
    padding: '3rem',
    paddingBottom: '5rem',
  },
  leftbar: {
    width: '15%',
    maxWidth: '16rem',
    minWidth: '12rem',
    background: '#fff',
  },
  topbar: {
    height: '4rem',
    background: '#fff',
  },
}

class Management extends React.Component {
  componentDidMount() {}

  render() {
    const { path } = this.props.match
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Topbar clazz={classes.topbar} />
        <div className={classes.bottom}>
          <Leftbar clazz={classes.leftbar} />
          <div className={classes.content}>
            <Switch>
              <Route path={`${path}/category`} key="/category" component={Category} />
              <Route path={`${path}/settings`} key="/settings" component={Settings} />
              <Route path={`${path}/statistics`} key="/statistics" component={Statistics} />

              <Route path={`${path}/blog/edit/:id`} key="/blog/edit" component={BlogEditor} />
              <Route path={`${path}/draft/edit/:id`} key="/draft/edit" component={BlogEditor} />
              <Route key="/blog/list" component={BlogList} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Management)
