import React from 'react'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'
import CardTemplate from './cardTemplate'

const data1 = {
  title: '个人分类',
  content: [
    { text: '这是一个分类2222222222222222', count: '5篇', link: 'blog/123', key: '1' },
    { text: '这是一个分类', count: '5篇', link: '', key: '2' },
    { text: '这是一个分类', count: '5篇', link: '', key: '4' },
    { text: '这是一个分类', count: '5篇', link: '', key: '3' },
    { text: '这是一个分类', count: '5篇', link: '', key: '5' },
  ],
  all: '',
}
const data2 = {
  title: '归档',
  content: [
    { text: '2018年6月2222222222222222', count: '5篇', link: '', key: '1' },
    { text: '2018年5月', count: '5篇', link: '', key: '2' },
    { text: '2018年4月', count: '5篇', link: '', key: '4' },
    { text: '2018年3月', count: '5篇', link: '', key: '3' },
    { text: '2018年2月', count: '5篇', link: '', key: '5' },
  ],
  all: '',
}
const styles = {
  rightBar: {
    padding: ['5rem', '3rem'],
  },
}
const RightBar = inject('appStore')(
  observer(({ appStore }) => (
    <aside className="sidebar" style={{ ...appStore.rightBarStyle }}>
      <div>
        <CardTemplate data={data1} />
        <CardTemplate data={data2} />
      </div>
    </aside>
  )),
)

export default injectSheet(styles)(RightBar)
