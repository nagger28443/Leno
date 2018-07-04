import React from 'react'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'
import _ from 'lodash'
import CardTemplate from './cardTemplate'
import { parsePath } from '../../util/utils'
import f from '../../util/f'

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
  active: {
    borderBottom: [1, 'solid', '#237567'],
    color: '#237567',
    paddingBottom: '0.2rem',
  },
  container: {
    '& ol': {
      paddingLeft: 0,
    },
    '& li': {
      listStyle: 'none',
    },
  },
  catalogList: {
    fontSize: 'smaller',
  },
  firstLevelItem: {
    counterIncrement: 'first',
    '&:before': {
      content: 'counter(first) "."',
    },
  },
}

const TABS = {
  catalog: '文章目录',
  categoryArchive: '分类·归档',
}

let prevPath = ''
let store
@inject('appStore')
@observer
class RightBar extends React.Component {
  constructor(props) {
    super(props)
    store = props.appStore
  }

  state = {
    curTab: TABS.categoryArchive,
    isCatalogVisible: false,
  }
  switchTab = e => {
    this.setState({ curTab: e.target.innerText })
  }
  componentDidMount() {
    prevPath = window.location.pathname
  }
  static getDerivedStateFromProps() {
    const { pathname } = window.location
    const prev = prevPath
    prevPath = pathname
    if (pathname !== prev) {
      return pathname.startsWith('/blog')
        ? { curTab: TABS.catalog, isCatalogVisible: true }
        : { curTab: TABS.categoryArchive, isCatalogVisible: false }
    }
    return null
  }
  contentFormatter = data => {
    const t = []
    data.forEach(item => {
      if (item.type === 'h2' || (item.type === 'h3' && t.length === 0)) {
        t.push({
          title: item.props.id,
          children: [],
        })
      } else if (item.type === 'h3') {
        f.lastEle(t).children.push({
          title: item.props.id,
        })
      }
    })
    return t
  }
  render() {
    const { classes } = this.props
    const { curTab, isCatalogVisible } = this.state
    return (
      <aside className="sidebar" style={{ ...store.rightBarStyle }}>
        <div className={classes.tabHeader}>
          <span
            className={`plain-link ${classes.tabTittle} ${
              curTab === TABS.catalog ? classes.active : ''
            }`}
            style={{ display: isCatalogVisible ? 'inline-block' : 'none' }}
            onMouseEnter={this.switchTab}>
            {TABS.catalog}
          </span>
          <span
            className={`plain-link ${classes.tabTittle} ${
              curTab === TABS.categoryArchive ? classes.active : ''
            }`}
            onMouseEnter={this.switchTab}>
            {TABS.categoryArchive}
          </span>
        </div>
        <div
          className={`${classes.container} `}
          style={{ display: curTab === TABS.catalog ? 'block' : 'none' }}>
          <ol className={classes.catalogList}>
            {this.contentFormatter(store.blogContent).map(item => (
              <li key={item.title} className={classes.firstLevelItem}>
                <a className="link">{item.title}</a>
                <ol>
                  {item.children.map(ele => (
                    <li key={ele.title} className={classes.secondLevelItem}>
                      <a className="link">{ele.title}</a>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
        <div
          className={`${classes.container}`}
          style={{ display: curTab === TABS.categoryArchive ? 'block' : 'none' }}>
          <CardTemplate data={data2} />
          <CardTemplate data={data1} />
        </div>
      </aside>
    )
  }
}

export default injectSheet(styles)(RightBar)
