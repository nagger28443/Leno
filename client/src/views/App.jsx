import {
  React, observable, observer, action,
} from 'src/commonExports'
import { Route, Switch } from 'react-router-dom'
import injectSheet from 'react-jss'
import _ from 'lodash'
import Banner from './banner'
import Category from './category'
import About from './about'
import Page404 from './page404'
import FullPage from './fullpage'
import RightBar from './rightBar'
import BlogList from './blogList'

const scrollToTop = () => {
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

@observer
class App extends React.Component {
  @observable isTopbar = window.matchMedia('(max-width: 1200px)').matches

  @observable hasRightbar = !window.matchMedia('(max-width: 960px)').matches

  @observable isAtTop = true

  componentDidMount() {
    this.resizeListener = _.throttle(this.handleResize, 50)
    this.scrollListener = _.throttle(this.handleScroll, 1000)
    window.addEventListener('resize', this.resizeListener, false)
    window.addEventListener('scroll', this.scrollListener, false)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener)
    window.removeEventListener('scroll', this.scrollListener)
  }

  @action
  handleResize = () => {
    this.isTopbar = window.matchMedia('(max-width: 1200px)').matches
  }

  @action
  handleScroll = () => {
    this.isAtTop = window.pageYOffset === 0
  }

  render() {
    const { classes } = this.props
    const { isTopbar, isAtTop, hasRightbar } = this
    const TagInside = isTopbar ? 'div' : React.Fragment
    return (
      <React.Fragment>
        <div className="leftbar">
          <Banner isTopbar={isTopbar} />
        </div>
        <TagInside style={{ backgroundColor: '#f5f5f5', flex: 1, display: 'flex' }}>
          <div style={{ flex: 1, maxWidth: '60rem' }}>
            <Switch>
              <Route path="/" exact key="/" component={BlogList} />
              <Route path="/category" key="/category" component={Category} />
              <Route path="/about" key="/about" component={About} />
              <Route path="/blog" key="/blog" component={FullPage} />
              <Route path="/list" key="/list" component={BlogList} />
              <Route key="404" component={Page404} />
            </Switch>
          </div>
          { hasRightbar ? (<div className="rightbar"><RightBar /></div>) : ''}
        </TagInside>
        <div
          onClick={scrollToTop}
          className={classes.toTop}
          title="To top"
          style={{ display: isAtTop ? 'none' : 'block' }}
        />
      </React.Fragment>
    )
  }
}
export default injectSheet(styles)(App)
