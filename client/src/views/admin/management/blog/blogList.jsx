import {
  React, injectSheet, get, fail, Link, dele,
} from 'src/commonExports'
import BlogListItem from 'src/views/commonComponents/blogListItem'
import _ from 'lodash'
import message from '../../../../echo/message'

const styles = {
  active: {
    borderBottom: '2px solid #807979',
  },
  actions: {
    position: 'absolute',
    right: 0,
    bottom: '0.6rem',
  },
  action: {
    margin: [0, '0.5rem'],
    fontSize: 'smaller',
  },
  getMore: {
    textAlign: 'center',
    margin: ['1rem', 0],
    fontSize: 'small',
  },
}

const menus = [
  {
    title: 'All',
    statName: 'allCnt',
    link: '/admin/blog/list',
    url: '/blog/list',
    params: {},
  },
  {
    title: 'Public',
    statName: 'publicCnt',
    link: '/admin/blog/list/public',
    url: '/blog/list',
    params: {
      isPrivate: 0,
    },
  },
  {
    title: 'Private',
    statName: 'privateCnt',
    link: '/admin/blog/list/private',
    url: '/blog/list',
    params: {
      isPrivate: 1,
    },
  },
  {
    title: 'Draft',
    statName: 'draftCnt',
    link: '/admin/blog/list/draft',
    url: '/draft/list',
    params: {},
  },
  {
    title: 'Recycle',
    statName: 'recycleCnt',
    link: '/admin/blog/list/recycle',
    url: '/recycle/list',
    params: {},
  },
]

const menuRegex = /^(\w+)\(\d+\)$/

class BlogList extends React.Component {
  constructor() {
    super()
    this.curPage = 0
    this.total = 0
    this.state = {
      curTab: 'All',
      stat: { },
      list: [],
    }
  }

  getData = async (tab) => {
    const list = tab ? [] : this.state.list

    const t = tab || this.state.curTab
    const { url, params } = menus.find(item => item.title === t)
    try {
      const data = await get(url, { ...params, page: ++this.curPage })
      this.total = data.total
      this.setState({
        list: [...list, ...data.result],
      })
    } catch (e) {
      fail(e)
    }
  }

  handleTabChange = (e) => {
    const text = e.target.innerText
    const tabName = menuRegex.exec(text)[1]

    const { pathname } = this.props.location
    this.props.history.push(pathname, { curTab: tabName })
  }

  handleDelete = async (e) => {
    const id = e.target.getAttribute('data-id')
    const { curTab } = this.state

    try {
      const isBlog = curTab === 'Public' || curTab === 'Private' || curTab === 'All'

      const params = { id }
      if (curTab === 'Recycle') {
        params.type = e.target.getAttribute('data-tp')
      }

      await dele(`/${isBlog ? 'blog' : curTab.toLowerCase()}`, params)
      message.info('Deleted successfully')

      const { list, stat } = this.state
      const { statName } = menus.find(item => item.title === curTab)
      stat[statName] -= 1
      if (curTab === 'Public' || curTab === 'Private') {
        stat.allCnt -= 1
      }
      if (curTab !== 'Recycle') {
        stat.recycleCnt += 1
      }

      this.setState({
        stat,
        list: list.filter(item => String(item.id) !== id),
      })
    } catch (err) {
      fail(err)
    }
  }

  handleScroll = () => {
    let prevHeight = 0
    return () => {
      const curHeight = window.pageYOffset
      const tmp = prevHeight
      prevHeight = curHeight

      if (tmp > curHeight || this.state.list.length >= this.total) return

      const maxHeight = document.body.clientHeight
      const windowHeight = window.outerHeight
      if (maxHeight - curHeight - windowHeight < 200) {
        this.getData()
      }
    }
  }

  async componentDidMount() {
    document.documentElement.scrollIntoView()
    this.scrollListener = _.throttle(this.handleScroll(), 500)
    window.addEventListener('scroll', this.scrollListener, false)

    const stat = await get('/statistics', { admin: true })
    Object.keys(stat).forEach(key => {
      stat[key] = Number(stat[key])
    })

    this.setState({
      stat: {
        ...stat,
        allCnt: stat.publicCnt + stat.privateCnt,
      },
    })

    const { curTab } = this.props.history.location.state || { curTab: 'All' }
    this.getData(curTab)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListener, false)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { curTab } = nextProps.history.location.state || { curTab: 'All' }
    if (curTab !== prevState.curTab) {
      return {
        curTab,
      }
    }
    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.curTab !== this.state.curTab) {
      this.curPage = 0
      this.getData(this.state.curTab)
    }
  }


  render() {
    const { classes } = this.props
    const { curTab, list, stat } = this.state
    return (
      <div>
        <div style={{ fontSize: 'smaller' }}>
          {menus.map(menu => (
            <span
              key={menu.title}
              className={`plain-link ${curTab === menu.title ? classes.active : ''}`}
              style={{ padding: '0 1rem 1rem 1rem' }}
              onClick={this.handleTabChange}
            >
              {menu.title}({stat[menu.statName]})
            </span>
          ))}
        </div>
        <hr className="hr" style={{ marginTop: 0 }} />
        <div style={{ display: list.length > 0 ? 'block' : 'none' }}>
          {list.map(item => (
            <div style={{ position: 'relative' }}>
              <BlogListItem data={item} isDraft={curTab === 'Draft'} isAdmin />
              <div className={classes.actions}>
                <Link
                  to={`/admin/${curTab === 'Draft' ? 'draft' : 'blog'}/edit/${item.id}`}
                  className={`plain-link ${classes.action}`}
                >
                    Edit
                </Link>
                <span style={{ color: '#dfdfdf' }}>|</span>
                <span
                  data-id={item.id}
                  data-tp={item.type}
                  className={`plain-link ${classes.action}`}
                  onClick={this.handleDelete}
                >
                    Delete
                </span>
              </div>
            </div>
          ))}
          <div className={classes.getMore}>
            {list.length < this.total ? (
              <span className="plain-link" onClick={this.getData}>
                {'<<<READ MORE>>>'}
              </span>
            ) : (
              'No MORE LEFT'
            )}
          </div>
        </div>
        <span style={{ display: list.length === 0 ? 'block' : 'none' }}>No records</span>
      </div>
    )
  }
}

export default injectSheet(styles)(BlogList)
