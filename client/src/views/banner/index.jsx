import React from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import injectSheet from 'react-jss'
import Links from './elements/links'
import SearchBox from './elements/searchBox'
import Menu from './elements/menu'
import Statistics from './elements/statistics'
import { SIDEBAR } from '../../constants'

const styles = {
  sidebar: {
    float: 'left',
    // margin: 'auto',
    // textAlign: 'center',
  },
  topbar: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}
const Banner = inject('appStore')(
  observer(({ classes, appStore }) => (
    <aside className={`banner ${appStore.bannerType}`} style={{ ...appStore.bannerStyle }}>
      <div className={appStore.bannerType === SIDEBAR ? classes.sidebar : classes.topbar}>
        <h1>
          <Link to="/" className="plain-link">
            EVO
          </Link>
        </h1>
        <Menu />
        <div style={appStore.bannerType === SIDEBAR ? {} : { display: 'none' }}>
          <Links />
          <p>如人饮水，冷暖自知。</p>
          <Statistics />
          <SearchBox />
        </div>
      </div>
    </aside>
  )),
)

export default injectSheet(styles)(Banner)
