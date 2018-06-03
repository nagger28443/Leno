import React from 'react'
import { inject, observer } from 'mobx-react'

const SideBar = inject('appStore')(
  observer(({ appStore }) => (
    <aside className={`banner ${appStore.barType}`} style={{ ...appStore.barStyle }}>
      <h3>sidebar</h3>
      <p>someting</p>
      <p>someting</p>
      <p>someting</p>
      <p>someting</p>
      <p>someting</p>
      <p>someting</p>
    </aside>
  )),
)

export default SideBar
