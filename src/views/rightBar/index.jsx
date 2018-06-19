import React from 'react'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'
import _ from 'lodash'
import CardTemplate from './cardTemplate'

const data1 = {
  title: '个人分类',
  content: _.range(0, 5).map((item, index) => ({
    text: '这是一个分类2222222222222222',
    count: '5篇',
    link: 'blog/123',
    key: index,
  })),
  all: '',
}
const data2 = {
  title: '归档',
  content: _.range(0, 5).map((item, index) => ({
    text: `2017年${12 - index}月2222222222222222`,
    count: '5篇',
    link: '',
    key: index,
  })),
  all: '',
}
const styles = {
  container: {},
}
const RightBar = inject('appStore')(
  observer(({ appStore, classes }) => (
    <aside className="sidebar" style={{ ...appStore.rightBarStyle }}>
      <div className={classes.container}>
        <CardTemplate data={data1} />
        <CardTemplate data={data2} />
      </div>
    </aside>
  )),
)

export default injectSheet(styles)(RightBar)
