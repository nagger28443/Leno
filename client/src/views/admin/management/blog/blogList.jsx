import {
  React, injectSheet, get, fail,
} from 'src/commonExports'
import BlogListItem from 'src/views/commonComponents/blogListItem'

const styles = {
  active: {
    borderBottom: '2px solid red',
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
    const { url, params } = menus.find(item => item.title === tab)
    try {
      const data = await get(url, { ...params, page: ++this.curPage })
      this.total = data.total
      this.setState({
        list: data.result,
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

  async componentDidMount() {
    const stat = await get('/statistics', { admin: true })
    this.setState({
      stat: {
        ...stat,
        allCnt: Number(stat.publicCnt) + Number(stat.privateCnt),
      },
    })

    const { curTab } = this.props.history.location.state || { curTab: 'All' }
    this.getData(curTab)
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
    console.log(prevState.curTab, this.state.curTab)
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
        <div>
          {list.length > 0
            ? list.map(item => (
              <div>
                <BlogListItem data={item} isDraft={curTab === 'Draft'} />
              </div>
            ))
            : <span>无记录</span>
          }
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(BlogList)
