import React from 'react'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'
import { SIDEBAR } from '../../constants'

const styles = {}
const Banner = inject('appStore')(
  observer(({ appStore }) => (
    <aside className={`banner ${appStore.barType}`} style={{ ...appStore.barStyle }}>
      <div style={appStore.barType === SIDEBAR ? { float: 'right' } : {}}>
        <h1>EVO</h1>
        <p>someting</p>
        <p>someting</p>
        <p>someting</p>
        <p>someting</p>
      </div>
    </aside>
  )),
)

export default injectSheet(styles)(Banner)
