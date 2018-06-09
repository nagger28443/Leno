import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import SideBar from './sideBar'
import Contnets from './contents'
import Archive from './archive'
import Labels from './labels'
import About from './about'
import Page404 from './page404'
import { TOPBAR } from '../constants'

const App = inject('appStore')(
  observer(({ appStore }) => (
    <React.Fragment>
      <div
        className="bar-place-holder"
        style={{ ...appStore.barStyle, display: appStore.barType === TOPBAR ? 'block' : 'none' }}
      />
      <SideBar />
      <Switch>
        <Route path="/" exact key="/Contnets" component={Contnets} />
        <Route path="/archive" key="/archive" component={Archive} />
        <Route path="/labels" key="/labels" component={Labels} />
        <Route path="/about" key="/about" component={About} />
        <Route key="404" component={Page404} />
      </Switch>
    </React.Fragment>
  )),
)
export default App
