import { React, injectSheet, _, get, fail, f, inject, observer, action} from 'src/commonExports' //eslint-disable-line
import { Detail } from '../../styledComponents'
import NomalList from './normal'

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
  search: '搜索关键字',
  category: '当前类目',
  labels: '当前标签',
  archive: '归档',
}

let store
@inject('blogListStore')
@observer
class BlogList extends React.Component {
  constructor(props) {
    super(props)
    store = props.blogListStore

    const params = this.props.location.search
    store.query = f.urlParamDecode(params)
  }

  @action
  updateQuery = () => {
    const params = this.props.location.search
    const query = f.urlParamDecode(params)
    if (!query) {
      this.props.history.push('/404')
    }
    store.query = query
  }

  componentDidMount() {
    document.documentElement.scrollIntoView()
    this.scrollListener = _.throttle(this.handleScroll(), 500)
    window.addEventListener('scroll', this.scrollListener, false)

    this.updateQuery()
    store.getData()
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListener, false)
    this.clearStore()
  }
  @action
  clearStore = () => {
    Object.assign(store, {
      getData: null,
      totalCount: 0,
      query: '',
      data: [],
    })
  }

  handleScroll = () => {
    let prevHeight = 0
    return () => {
      const curHeight = window.pageYOffset
      const tmp = prevHeight
      prevHeight = curHeight

      if (tmp > curHeight || store.data.length >= store.totalCount) return

      const maxHeight = document.body.clientHeight
      const windowHeight = window.outerHeight
      if (maxHeight - curHeight - windowHeight < 200) {
        store.getData()
      }
    }
  }

  componentDidUpdate(prevProps) {
    const curParams = this.props.location.search
    const prevParams = prevProps.location.search
    if (!f.isEqual(curParams, prevParams)) {
      document.documentElement.scrollIntoView()
      this.clearStore()
      this.updateQuery()
      store.getData()
    }
  }

  render() {
    const { classes } = this.props
    const { data, query } = store
    const title = Object.keys(query)[0]
    return (
      <Detail>
        <div className={classes.title}>
          <span>{`${TITLE[title]}：${query[title]}`}</span>
        </div>
        <div style={{ display: data.length === 0 ? 'block' : 'none', textAlign: 'center' }}>
          无记录
        </div>
        <div style={{ display: data.length > 0 ? 'block' : 'none' }}>
          <NomalList />
          <div className={classes.getMore}>
            {data.length < this.totalCount ? (
              <span className="plain-link" onClick={store.getData}>
                {'<<<加载更多>>>'}
              </span>
            ) : (
              '没有更多了'
            )}
          </div>
        </div>
      </Detail>
    )
  }
}
export default injectSheet(styles)(BlogList)
