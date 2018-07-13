import React from 'react'
import { Route, Switch } from 'react-router-dom'
import injectSheet from 'react-jss'
import _ from 'lodash'
import Banner from './banner'
import Home from './home'
import Archive from './archive'
import Labels from './labels'
import Category from './category'
import About from './about'
import Page404 from './page404'
import FullPage from './fullpage'
import RightBar from './rightBar'
import SearchResult from './search'

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

class App extends React.Component {
  state = {
    isTopbar: window.matchMedia(`(max-width: 1200px)`).matches,
  }
  componentDidMount() {
    window.addEventListener('resize', _.throttle(this.handleResize, 50), false)
  }
  handleResize = () => {
    const isTopbar = window.matchMedia(`(max-width: 1200px)`).matches
    if (isTopbar !== this.state.isTopbar) {
      this.setState({ isTopbar })
    }
  }

  render() {
    const { classes } = this.props
    const { isTopbar } = this.state
    const TagInside = isTopbar ? 'div' : React.Fragment
    return (
      <React.Fragment>
        {/* <div
          style={{
            display: isTopbar ? 'block' : 'none',
            minHeight: '3.5rem',
            maxHeight: '6rem',
          }}
        /> */}
        <div className="leftbar">
          <Banner />
        </div>
        <TagInside style={{ backgroundColor: '#f5f5f5', flex: 1, display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <Switch>
              <Route path="/" exact key="/" component={Home} />
              <Route path="/archive" key="/archive" component={Archive} />
              <Route path="/category" key="/category" component={Category} />
              <Route path="/label" key="/label" component={Labels} />
              <Route path="/about" key="/about" component={About} />
              <Route path="/blog" key="/fullpage" component={FullPage} />
              <Route path="/search/:params" key="/search" component={SearchResult} />
              <Route key="404" component={Page404} />
            </Switch>
          </div>
          <div className="rightbar">
            <RightBar />
          </div>
        </TagInside>
        <div
          onClick={srcollToTop}
          className={classes.toTop}
          title="返回顶部"
          style={{ display: window.pageYOffset > 0 ? 'block' : 'none' }}
        />
      </React.Fragment>
    )
  }
}
export default injectSheet(styles)(App)
