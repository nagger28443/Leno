import {
  React, injectSheet, _, get, fail, f, inject, observer, action,
} from 'src/commonExports'
import { runInAction } from 'mobx'
import { Detail } from '../../styledComponents'
import NormalList from './normalList'
import Archive from './archive'
import Home from './home'

const styles = {
  title: {
    position: 'absolute',
    right: '3rem',
    top: '2rem',
  },
  getMore: {
    textAlign: 'center',
    margin: ['1rem', 0],
    fontSize: 'small',
  },
}
const TITLE = {
  search: 'Search',
  category: 'Category',
  labels: 'Label',
  archive: 'Archive',
}

let store
@inject('blogListStore')
@observer
class BlogList extends React.Component {
  constructor(props) {
    super(props)
    store = props.blogListStore
    this.curPage = 0
    this.state = {
      isLoading: true,
    }
  }

  getData = async () => {
    this.setState({
      isLoading: true,
    })
    const { query } = store
    try {
      const res = await get('/blog/list', { ...query, page: ++this.curPage })
      this.setState({
        isLoading: false,
      })
      runInAction(() => {
        store.total = res.total
        store.data = [...store.data, ...res.result]
      })
    } catch (e) {
      fail(e)
    }
  }

  @action
  updateQuery = () => {
    this.clearCache()
    const { pathname } = this.props.location
    if (pathname === '/') {
      store.query = { hasDetail: true, pageSize: 10 }
      return
    }
    const params = this.props.location.search
    const query = f.urlParamDecode(params)
    if (!query) {
      this.props.history.push('/404')
    }
    store.query = query
  }

  @action
  componentDidMount() {
    document.documentElement.scrollIntoView()
    this.scrollListener = _.throttle(this.handleScroll(), 500)
    window.addEventListener('scroll', this.scrollListener, false)

    const params = this.props.location.search
    store.query = f.urlParamDecode(params)
    this.updateQuery()
    this.getData()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListener, false)
    this.clearCache()
  }

  @action
  clearCache = () => {
    this.curPage = 0
    Object.assign(store, {
      total: 0,
      query: {},
      data: [],
    })
  }

  handleScroll = () => {
    let prevHeight = 0
    return () => {
      const curHeight = window.pageYOffset
      const tmp = prevHeight
      prevHeight = curHeight

      if (tmp > curHeight || store.data.length >= store.total) return

      const maxHeight = document.body.clientHeight
      const windowHeight = window.outerHeight
      if (maxHeight - curHeight - windowHeight < 200) {
        this.getData()
      }
    }
  }

  componentDidUpdate(prevProps) {
    const curParams = this.props.location.search
    const prevParams = prevProps.location.search
    if (!f.isEqual(curParams, prevParams)) {
      document.documentElement.scrollIntoView()
      this.updateQuery()
      this.getData()
    }
  }

  render() {
    const { classes } = this.props
    const { data, query } = store
    const { isLoading } = this.state
    const title = Object.keys(query)[0]

    let content
    if (query.hasDetail) {
      content = <Home />
    } else if (title === 'archive') {
      content = <Archive />
    } else {
      content = <NormalList />
    }

    const loadingIcon = <div className="loading" />

    const innerElements = (
      isLoading ? loadingIcon
        : (
          <div className="fadein">
            <div className={classes.title} style={{ display: query.hasDetail ? 'none' : 'block' }}>
              <span style={{ opacity: 0.7, marginRight: '0.5rem', display: 'inline-block' }}>{`${TITLE[title]}:`}</span>
              <span>{`${query[title] === 'all' ? 'All' : query[title]}`}</span>
            </div>
            <div style={{ display: data.length === 0 ? 'block' : 'none', textAlign: 'center' }}>
         No records
            </div>
            <div style={{ display: data.length > 0 ? 'block' : 'none' }}>
              {content}
              <div className={classes.getMore}>
                {data.length < this.total ? (
                  <span className="plain-link" onClick={store.getData}>
                    {'<<<READ MORE>>>'}
                  </span>
                ) : (
                  'NO MORE LEFT'
                )}
              </div>
            </div>
          </div>
        )
    )

    if (query.hasDetail) {
      return (<div>{innerElements}</div>)
    }
    return (<Detail>{innerElements}</Detail>)
  }
}
export default injectSheet(styles)(BlogList)
