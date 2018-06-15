import React from 'react'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'
import Blog from './blog'

const styles = {}
const Home = inject('appStore')(
  observer(() => (
    <React.Fragment>
      <Blog />
      <Blog />
      <Blog />
      <Blog />
      <Blog />
    </React.Fragment>
  )),
)

export default injectSheet(styles)(Home)
