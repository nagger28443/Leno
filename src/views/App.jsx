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
import { TOPBAR, SIDEBAR } from '../constants'
import FullPage from './fullpage'
import RightBar from './rightBar'

const App = inject('appStore')(
  observer(({ appStore }) => {
    const TagInside = appStore.bannerType === SIDEBAR ? React.Fragment : 'div'

    return (
      <React.Fragment>
        <div
          style={{
            ...appStore.bannerStyle,
            display: appStore.bannerType === TOPBAR ? 'block' : 'none',
            minHeight: '3.5rem',
            maxHeight: '6rem',
          }}
        />
        <Banner />
        <TagInside style={{ backgroundColor: '#f5f5f5', flex: 1, display: 'flex' }}>
          <div>
            <Switch>
              <Route path="/" exact key="/" component={Home} />
              <Route path="/archive" key="/archive" component={Archive} />
              <Route path="/labels" key="/labels" component={Labels} />
              <Route path="/about" key="/about" component={About} />
              <Route path="/admin" key="/admin" component={Admin} />
              <Route path="/blog/:blog" key="/fullpage" component={FullPage} />
              <Route key="404" component={Page404} />
            </Switch>
          </div>
          <RightBar />
        </TagInside>
      </React.Fragment>
    )
  }),
)
export default App
