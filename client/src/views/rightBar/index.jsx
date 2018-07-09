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
    borderBottom: [1, 'dashed', '#237567'],
    color: '#237567',
    paddingBottom: '0.2rem',
  },
  container: {
    height: '100%',
    overflow: 'auto',
    '& ol': {
      paddingLeft: 0,
    },
    '& li': {
      listStyle: 'none',
    },
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  catalogList: {
    fontSize: 'smaller',
    '& a': {
      display: 'inline',
    },
  },
  firstLevelItem: {
    counterIncrement: 'first',
    lineHeight: 2.2,
    '& ol': {
      overflow: 'hidden',
      height: 0,
    },
    '&:before': {
      fontSize: 'smaller',
      content: 'counter(first) "."',
    },
  },
  secondLevelItem: {
    marginLeft: '0.9rem',
    lineHeight: 1.8,
    counterIncrement: 'second',
    color: 'inherit',
    '&:before': {
      fontSize: 'smaller',
      content: 'counter(first) "." counter(second) "."',
    },
  },
  // expanded: {},
  // folded: {
  //   '& ol': {
  //     transition: 'height 0.5s',
  //     height: 0,
  //     overflow: 'hidden',
  //   },
  // },
  activeAnchor: {
    color: 'red',
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
    this.state = {
      curTab: TABS.categoryArchive,
      isCatalogVisible: false,
      parentAnchorId: '',
      childAnchorId: '',
      anchors: [],
    }
  }

  switchTab = e => {
    this.setState({ curTab: e.target.innerText })
  }

  updateAnchor = () => {
    let parent = null
    let prevId = null
    const { anchors } = this.state
    for (let i = 0; i < anchors.length && anchors[i].offset <= window.pageYOffset; ++i) {
      if (parent !== anchors[i].title) {
        parent = anchors[i].title
        prevId = anchors[i].title
      }
      for (
        let j = 0;
        j < anchors[i].children.length && anchors[i].children[j].offset <= window.pageYOffset;
        ++j
      ) {
        prevId = anchors[i].children[j].title
      }
    }
    this.setState({
      parentAnchorId: parent,
      childAnchorId: prevId,
    })
  }
  componentDidMount() {
    window.addEventListener('scroll', _.debounce(this.updateAnchor, 100), false)
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
    let ele
    data.forEach(item => {
      if (item.type === 'h2' || (item.type === 'h3' && t.length === 0)) {
        ele = document.getElementById(item.props.id)
        t.push({
          title: item.props.id,
          offset: ele ? ele.offsetTop : 0,
          children: [],
        })
      } else if (item.type === 'h3') {
        ele = document.getElementById(item.props.id)
        f.lastEle(t).children.push({
          title: item.props.id,
          offset: ele ? ele.offsetTop : 0,
        })
      }
    })
    console.log(t)
    return t
  }
  handleScrollTo = e => {
    const id = e.target.innerText
    window.scrollTo({
      top: document.getElementById(id).offsetTop,
      behavior: 'smooth',
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.anchors.length === 0 && store.blogContent.length !== 0) {
      this.setState({ //eslint-disable-line
        anchors: this.contentFormatter(store.blogContent),
      })
    }
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
            {store.blogContent.length &&
              this.state.anchors.map(item => (
                <li key={item.title} className={classes.firstLevelItem}>
                  <a
                    className={`link ${
                      this.state.childAnchorId === item.title ? classes.active : ''
                    }`}
                    onClick={this.handleScrollTo}>
                    {item.title}
                  </a>
                  <ol style={{ height: this.state.parentAnchorId === item.title ? '100%' : 0 }}>
                    {item.children.map(ele => (
                      <li key={ele.title} className={classes.secondLevelItem}>
                        <a
                          className={`link ${
                            this.state.childAnchorId === ele.title ? classes.active : ''
                          }`}
                          onClick={this.handleScrollTo}>
                          {ele.title}
                        </a>
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
