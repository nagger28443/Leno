import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from './login'
import Management from './management'

class Admin extends React.Component {
  componentDidMount() {}
  render() {
    return (
      <Switch>
        <Route path="/admin/login" key="/login" component={Login} />
        <Route key="/management" component={Management} />
      </Switch>
    )
  }
}

export default Admin
