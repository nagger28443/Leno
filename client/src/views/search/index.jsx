import { React, injectSheet, _, get, fail, f } from 'src/commonExports' //eslint-disable-line
import { Detail } from '../../styledComponents'
import BlogListItem from '../commonComponents/blogListItem'

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
  label: '当前标签',
}
class BlogList extends React.Component {
  state = {
    data: [],
    query: '',
  }
  totalCount = 0
  curPage = 0

  getData = () => {
    const params = this.props.location.search
    const query = f.urlParamDecode(params)
    if (!query) {
      this.props.history.push('/404')
    }

    this.setState({
      query,
    })
    get('/blog/list', {
      ...query,
      page: ++this.curPage,
    })
      .then(resp => {
        this.totalCount = resp.totalCount
        this.setState({
          data: [...this.state.data, ...resp.result],
        })
      })
      .catch(err => {
        fail(err)
      })
  }

  componentDidMount() {
    document.documentElement.scrollIntoView()
    window.addEventListener('scroll', _.throttle(this.handleScroll(), 500), false)
    this.getData()
  }

  handleScroll = () => {
    let prevHeight = 0
    return () => {
      const curHeight = window.pageYOffset
      const tmp = prevHeight
      prevHeight = curHeight

      if (tmp > curHeight || this.state.data.length >= this.totalCount) return

      const maxHeight = document.body.clientHeight
      const windowHeight = window.outerHeight
      if (maxHeight - curHeight - windowHeight < 200) {
        this.getData({})
      }
    }
  }

  componentDidUpdate(prevProps) {
    const curParams = this.props.location.search
    const prevParams = prevProps.location.search
    if (!f.isEqual(curParams, prevParams)) {
      document.documentElement.scrollIntoView()
      this.curPage = 0
      this.getData()
    }
  }
  render() {
    const { classes } = this.props
    const { data, query } = this.state
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
          {data.map(item => <BlogListItem data={item} key={item.id} />)}
          <div className={classes.getMore}>
            {data.length < this.totalCount ? (
              <span className="plain-link" onClick={this.getData}>
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
