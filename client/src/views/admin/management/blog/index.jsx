import { React, injectSheet,Switch, Route, get } from 'src/commonExports' //eslint-disable-line
import BlogEditor from './blogEditor'
import BlogList from './blogList'

const styles = {}

class Blog extends React.Component {
  componentDidMount() {}

  render() {
    const { path } = this.props.match
    return (
      <Switch>
        <Route path={`${path}/list`} key="/list" component={BlogList} />
        <Route path={`${path}/edit`} key="/category" component={BlogEditor} />
      </Switch>
    )
  }
}

export default injectSheet(styles)(Blog)
