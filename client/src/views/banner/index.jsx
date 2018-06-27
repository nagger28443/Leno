import React from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import injectSheet from 'react-jss'
import Links from './elements/links'
import SearchBox from './elements/searchBox'
import Menu from './elements/menu'
import { SIDEBAR } from '../../constants'

const styles = {}
const Banner = inject('appStore')(
  observer(({ appStore }) => (
    <aside className={`banner ${appStore.bannerType}`} style={{ ...appStore.bannerStyle }}>
      <div
        style={
          appStore.bannerType === SIDEBAR
            ? { float: 'left' }
            : {
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }
        }>
        <h1>
          <Link to="/" className="plain-link">
            EVO
          </Link>
        </h1>
        <Menu />
        <div style={appStore.bannerType === SIDEBAR ? {} : { display: 'none' }}>
          <Links />
          <p>如人饮水，冷暖自知。</p>
          <SearchBox />
          <p>someting</p>
          <p>someting</p>
          <p>someting</p>
          <p>someting</p>
        </div>
      </div>
    </aside>
  )),
)

export default injectSheet(styles)(Banner)
