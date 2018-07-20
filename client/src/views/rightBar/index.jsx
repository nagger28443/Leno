import React from 'react'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'
import _ from 'lodash'
import CardTemplate from './cardTemplate'
import { fail } from '../../util/utils'
import f from '../../util/f'
import { get } from '../../util/http'

const styles = {
  tabHeader: {
    marginBottom: '1rem',
    marginTop: '0.4rem',
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
  activeAnchor: {
    color: 'red',
  },
}

const TABS = {
  catalog: '文章目录',
  categoryArchive: '分类·归档',
}
const anchorRegex = /<(h[23])\sid=(.*?)>.*?<\/\1>/g

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
      categories: {
        title: '分类',
        all: '/category',
        content: [],
      },
      archives: {
        title: '归档',
        all: '/list?archive=all',
        content: [],
      },
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
    this.scrollListener = _.throttle(this.updateAnchor, 50)
    window.addEventListener('scroll', this.scrollListener, false)
    prevPath = window.location.pathname

    get('/category/list', {
      page: 1,
      pageSize: 5,
    })
      .then(resp => {
        const { categories } = this.state
        categories.content = resp.result.map(item => ({
          ...item,
          link: `/list?category=${item.name}`,
        }))
        this.setState({
          categories,
        })
      })
      .catch(err => {
        fail(err)
      })
    get('/archive/list', {
      page: 1,
      pageSize: 5,
    })
      .then(resp => {
        const { archives } = this.state
        archives.content = resp.result.map(item => ({
          ...item,
          name: item.date,
          link: `/list?archive=${item.date}`,
        }))
        this.setState({
          archives,
        })
      })
      .catch(err => {
        fail(err)
      })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListener)
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
    // const ids = anchorRegex.exec(data)
    let arr
    const t = []
    let ele
    while ((arr = anchorRegex.exec(data)) !== null) {
      const tag = arr[1]
      const id = arr[2]
      if (tag === 'h2' || t.length === 0) {
        ele = document.getElementById(id)
        t.push({
          title: id,
          offset: ele ? ele.offsetTop : 0,
          children: [],
        })
      } else if (tag === 'h3') {
        ele = document.getElementById(id)
        f.lastEle(t).children.push({
          title: id,
          offset: ele ? ele.offsetTop : 0,
        })
      }
    }
    return t
  }

  handleScrollTo = e => {
    const id = e.target.innerText
    window.scrollTo({
      top: document.getElementById(id).offsetTop,
      behavior: 'smooth',
    })
  }

  componentDidUpdate() {
    // 如何用更好的的方式解决这个问题, 当前方式太蹩脚 todo
    if (!this.gotAnchors && store.blogContent.length !== 0) {
      this.gotAnchors = true
      this.setState({ //eslint-disable-line
        anchors: this.contentFormatter(store.blogContent),
      })
    }
  }

  render() {
    const { classes } = this.props
    const {
      curTab, isCatalogVisible, categories, archives, anchors, childAnchorId, parentAnchorId,
    } = this.state
    return (
      <aside className="bar-inside">
        <div className={classes.tabHeader}>
          <span
            className={`plain-link ${classes.tabTittle} ${
              curTab === TABS.catalog ? classes.active : ''
            }`}
            style={{ display: isCatalogVisible ? 'inline-block' : 'none' }}
            onMouseEnter={this.switchTab}
          >
            {TABS.catalog}
          </span>
          <span
            className={`plain-link ${classes.tabTittle} ${
              curTab === TABS.categoryArchive ? classes.active : ''
            }`}
            onMouseEnter={this.switchTab}
          >
            {TABS.categoryArchive}
          </span>
        </div>
        <div
          className={`${classes.container} `}
          style={{ display: curTab === TABS.catalog ? 'block' : 'none' }}
        >
          <ol className={classes.catalogList}>
            {store.blogContent.length
              && anchors.map(item => (
                <li key={item.title} className={classes.firstLevelItem}>
                  <a
                    className={`link ${
                      childAnchorId === item.title ? classes.active : ''
                    }`}
                    onClick={this.handleScrollTo}
                  >
                    {item.title}
                  </a>
                  <ol style={{ height: parentAnchorId === item.title ? '100%' : 0 }}>
                    {item.children.map(ele => (
                      <li key={ele.title} className={classes.secondLevelItem}>
                        <a
                          className={`link ${
                            childAnchorId === ele.title ? classes.active : ''
                          }`}
                          onClick={this.handleScrollTo}
                        >
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
          style={{ display: curTab === TABS.categoryArchive ? 'block' : 'none' }}
        >
          <CardTemplate data={categories} />
          <CardTemplate data={archives} />
        </div>
      </aside>
    )
  }
}

export default injectSheet(styles)(RightBar)
