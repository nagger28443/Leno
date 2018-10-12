import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import Links from './elements/links'
import SearchBox from './elements/searchBox'
import Menu from './elements/menu'
import Statistics from './elements/statistics'
import { observer, observable, action } from '../../commonExports'

@observer
class Banner extends React.Component {
  @observable isBannerCollapsed = false

  componentDidMount() {
    this.scrollListener = _.throttle(this.handleScroll(), 50)
    window.addEventListener('scroll', this.scrollListener, false)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListener)
  }

  handleScroll = () => {
    let prevY = 0
    return action(() => {
      if (!this.props.isTopbar) return

      const curY = window.pageYOffset
      this.isBannerCollapsed = curY - prevY > 0
      prevY = curY
    })
  }

  render() {
    const { isBannerCollapsed } = this
    const { isTopbar } = this.props
    return (
      <aside
        className={isTopbar ? 'banner' : 'bar-inside'}
        style={isTopbar ? { height: isBannerCollapsed ? 0 : '100vh' } : {}}
      >
        <h1 className="banner-title">
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
