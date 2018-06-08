import React from 'react'
import { inject, observer } from 'mobx-react'
// import injectSheet from 'react-jss'
import Blog from './blog'

const Contents = inject('appStore')(
  observer(({ appStore }) => (
    <div className="contents" style={{ ...appStore.contentStyle }}>
      <Blog />

    </div>
  )),
)

export default Contents
