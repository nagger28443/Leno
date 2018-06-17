import React from 'react'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'
import ArchiveAbstract from './elements/archiveAbstract'
import InfoAbstract from './elements/infoAbstract'
// import { SIDEBAR } from '../../constants'

const styles = {
  rightBar: {
    padding: ['5rem', '3rem'],
  },
}
const RightBar = inject('appStore')(
  observer(({ appStore }) => (
    <aside className="sidebar" style={{ ...appStore.rightBarStyle }}>
      <div style={{ float: 'left' }}>
        <InfoAbstract />
        <ArchiveAbstract />
        <p>someting</p>
        <p>someting</p>
        <p>someting</p>
        <p>someting</p>
      </div>
    </aside>
  )),
)

export default injectSheet(styles)(RightBar)
