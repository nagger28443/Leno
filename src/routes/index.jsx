import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Page404 from '../../src/views/page404'
import Catalog from '../../src/views/catalog'
import Tags from '../../src/views/tags'

const Routes = () => (
  <Switch>
    <Route path="/" exact key="/" />
    <Route path="/catalog" key="catalog" component={Catalog} />
    <Route path="/tags" key="/tags" component={Tags} />
    <Route key="404" component={Page404} />
  </Switch>
)

export default Routes
