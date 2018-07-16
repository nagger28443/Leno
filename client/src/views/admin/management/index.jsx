import { React, injectSheet,inject, observer, get } from 'src/commonExports' //eslint-disable-line
import { Switch, Route } from 'react-router-dom'
import Topbar from './topbar'
import Leftbar from './leftbar'
import Blog from './blog'
import Category from './category'
import Label from './label'
import Statistics from './statistics'

const styles = {
  root: {
    width: '100%',
    minHeight: '100vh',
  },
  bottom: {
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '100rem',
    minHeight: '40rem',
    marginTop: '1.2rem',
  },
  content: {
    flex: 1,
    background: '#fff',
    marginLeft: '0.2rem',
  },
}

class Management extends React.Component {
  componentDidMount() {}
  render() {
    const { path } = this.props.match
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Topbar />
        <div className={classes.bottom}>
          <Leftbar />
          <div className={classes.content}>
            <Switch>
              <Route path={`${path}/blog`} key="/blog" component={Blog} />
              <Route path={`${path}/category`} key="/category" component={Category} />
              <Route path={`${path}/label`} key="/label" component={Label} />
              <Route key="/statistics" component={Statistics} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Management)
