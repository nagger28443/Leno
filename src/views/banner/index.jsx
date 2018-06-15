import React from 'react'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'
import Archive from './elements/archive'
import Links from './elements/links'
import SearchBox from './elements/searchBox'
import Menu from './elements/menu'

const styles = {
  root: {
    float: 'right',
  },
}
const Banner = inject('appStore')(
  observer(({ appStore, classes }) => (
    <aside className={`banner ${appStore.barType}`} style={{ ...appStore.barStyle }}>
      <div className={classes.root}>
        <h1>EVO</h1>
        <Menu />
        <Links />
        <Archive />
        <SearchBox />
        <p>someting</p>
        <p>someting</p>
        <p>someting</p>
        <p>someting</p>
      </div>
    </aside>
  )),
)

export default injectSheet(styles)(Banner)
