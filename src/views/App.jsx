import React from 'react'
import { Route, Switch } from 'react-router-dom'
import SideBar from './sideBar'
import Contnets from './contents'
import Catalog from './catalog'
import Tags from './tags'
import Page404 from './page404'

const App = () => (
  <React.Fragment>
    <SideBar />
    <Switch>
      <Route path="/" exact key="/contents" component={Contnets} />
      <Route path="/catalog" key="catalog" component={Catalog} />
      <Route path="/tags" key="/tags" component={Tags} />
      <Route key="404" component={Page404} />
    </Switch>
  </React.Fragment>
)
export default App
