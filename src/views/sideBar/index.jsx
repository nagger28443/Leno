import React from 'react'
import { inject, observer } from 'mobx-react'
import Catalog from './catalog'
import Links from './links'
import SearchBox from './searchBox'
import Menu from './menu'

const SideBar = inject('appStore')(
  observer(({ appStore }) => (
    <aside className={`banner ${appStore.barType}`} style={{ ...appStore.barStyle }}>
      <h1>EVO</h1>
      <Menu />
      <Links />
      <Catalog />
      <SearchBox />
      <p>someting</p>
      <p>someting</p>
      <p>someting</p>
      <p>someting</p>
    </aside>
  )),
)

export default SideBar
