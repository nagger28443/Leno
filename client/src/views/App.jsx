import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'
import Banner from './banner'
import Home from './home'
import Archive from './archive'
import Labels from './labels'
import About from './about'
import Page404 from './page404'
import { TOPBAR, SIDEBAR } from '../constants'
import FullPage from './fullpage'
import RightBar from './rightBar'

const srcollToTop = () => {
  document.documentElement.scrollIntoView()
}
const styles = {
  toTop: {
    position: 'fixed',
    bottom: '1rem',
    right: '1rem',
    cursor: 'pointer',
    width: 0,
    height: 0,
    borderLeft: '0.7rem solid transparent',
    borderRight: '0.7rem solid transparent',
    borderBottom: '1rem solid #acacacde',
    transition: 'transform 0.5s',
    '&:hover': {
      borderBottom: '1rem solid #504e4ede',
      transform: 'scale(1.2)',
    },
  },
}

const App = inject('appStore')(
  observer(({ appStore, classes }) => {
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
          <div style={{ flex: 1 }}>
            <Switch>
              <Route path="/" exact key="/" component={Home} />
              <Route path="/archive" key="/archive" component={Archive} />
              {/* todo */}
              <Route path="/label" key="/label" component={Labels} />
              {/* todo */}
              <Route path="/about" key="/about" component={About} />
              <Route path="/blog" key="/fullpage" component={FullPage} />
              <Route key="404" component={Page404} />
            </Switch>
          </div>
          <RightBar />
        </TagInside>
        <div
          onClick={srcollToTop}
          className={classes.toTop}
          title="返回顶部"
          style={{ display: window.pageYOffset > 0 ? 'block' : 'none' }}
        />
      </React.Fragment>
    )
  }),
)
export default injectSheet(styles)(App)
