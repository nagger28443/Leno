import React from 'react'
import { inject, observer } from 'mobx-react'
// import injectSheet from 'react-jss'
import Blog from './blog'

const Contents = inject('appStore')(
  observer(() => (
    <div className="contents">
      <Blog />
      <Blog />
      <Blog />
      <Blog />
      <Blog />
    </div>
  )),
)

export default Contents
