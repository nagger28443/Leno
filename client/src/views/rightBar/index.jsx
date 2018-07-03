import React from 'react'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'
import _ from 'lodash'
import CardTemplate from './cardTemplate'
import { parsePath } from '../../util/utils'

const data1 = {
  title: '个人分类',
  content: _.range(0, 5).map((item, index) => ({
    title: '这是一个分类2222222222222222',
    count: '5篇',
    path: '/category/react',
    key: index,
  })),
  all: '/category',
}
const data2 = {
  title: '归档',
  content: _.range(0, 5).map((item, index) => ({
    title: `2017年8月2222222222222222`,
    date: '2017-08',
    count: '5篇',
    path: parsePath({ type: 'archive', dateStr: '2017-05', title: '2017年8月2222222222222222' }),
    key: index,
  })),
  all: '/archive',
}
const styles = {
  tabHeader: {
    marginBottom: '1rem',
    textAlign: 'center',
    fontSize: 'smaller',
  },
  tabTittle: {
    margin: [0, '0.5rem'],
  },
  container: {},
}

const tabs = {
  catalog: '文章目录',
  categoryArchive: '分类·归档',
}

@inject('appStore')
@observer
class RightBar extends React.Component {
  switchTab = e => {
    console.log(e.target.innerText)
  }
  render() {
    const { appStore, classes } = this.props
    return (
      <aside className="sidebar" style={{ ...appStore.rightBarStyle }}>
        <div className={classes.tabHeader}>
          <span className={`plain-link ${classes.tabTittle}`} style={{}} onClick={this.switchTab}>
            {tabs.catalog}
          </span>
          <span className={`plain-link ${classes.tabTittle}`}>{tabs.categoryArchive}</span>
        </div>
        <div className={classes.container}>
          <CardTemplate data={data2} />
          <CardTemplate data={data1} />
        </div>
      </aside>
    )
  }
}

export default injectSheet(styles)(RightBar)
