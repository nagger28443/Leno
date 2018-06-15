import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import Banner from './banner'
import Home from './home'
import Archive from './archive'
import Labels from './labels'
import About from './about'
import Page404 from './page404'
import Admin from './admin'
import { TOPBAR } from '../constants'
import FullPage from './fullpage'

const App = inject('appStore')(
  observer(({ appStore }) => (
    <React.Fragment>
      <div
        className="bar-place-holder"
        style={{
          ...appStore.barStyle,
          display: appStore.barType === TOPBAR ? 'block' : 'none',
          minHeight: '6rem',
          maxHeight: '10rem',
        }}
      />
      <Banner />
      <div style={{ backgroundColor: '#f5f5f5', flex: 1, maxWidth: '55rem' }}>
        <Switch>
          <Route path="/" exact key="/home" component={Home} />
          <Route path="/archive" key="/archive" component={Archive} />
          <Route path="/labels" key="/labels" component={Labels} />
          <Route path="/about" key="/about" component={About} />
          <Route path="/admin" key="/admin" component={Admin} />
          <Route path="/blog/:blog" key="/fullpage" component={FullPage} />
          <Route key="404" component={Page404} />
        </Switch>
      </div>
    </React.Fragment>
  )),
)
export default App
