import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import Links from './elements/links'
import SearchBox from './elements/searchBox'
import Menu from './elements/menu'
import Statistics from './elements/statistics'

class Banner extends React.Component {
  state = {
    isBannerCollapsed: false,
    isTopbar: false,
  }

  componentDidMount() {
    this.scrollListener = _.throttle(this.handleScroll(), 50)
    window.addEventListener('scroll', this.scrollListener, false)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListener)
  }

  handleScroll = () => {
    let prevY = 0
    return () => {
      const { isTopbar, isBannerCollapsed } = this.state
      const curY = window.pageYOffset
      const down = curY - prevY > 0

      prevY = curY

      if (!isTopbar) return
      if (down && !isBannerCollapsed) {
        this.setState({
          isBannerCollapsed: true,
        })
      } else if (!down && isBannerCollapsed) {
        this.setState({
          isBannerCollapsed: false,
        })
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const isTopbar = window.matchMedia('(max-width: 1200px)').matches
    if (isTopbar !== prevState.isTopbar) {
      return {
        isTopbar,
      }
    }
    return null
  }

  render() {
    const { isBannerCollapsed, isTopbar } = this.state
    return (
      <aside
        className={isTopbar ? 'banner' : 'bar-inside'}
        style={isTopbar ? { height: isBannerCollapsed ? 0 : '100vh' } : {}}
      >
        <h1>
          <Link to="/" className="plain-link">
            Illusion
          </Link>
          <Links />
        </h1>
        <Menu />
        <div className="leftbar-extra">
          <p>Warm or cold, can not be told.</p>
          <Statistics />
          <SearchBox />
        </div>
      </aside>
    )
  }
}

export default Banner
