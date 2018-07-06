import React from 'react'
import injectSheet from 'react-jss'
import { Detail } from '../../styledComponents'
// import NoContent from '../commonComponents/noContent'
import BlogListItem from '../commonComponents/blogListItem'
import { get } from '../../util/http'
import { fail } from '../../util/utils'
import Paging from '../commonComponents/paging'

const styles = {
  // root: {
  //   position: 'relative',
  //   paddingLeft: '2rem',
  // },
  checkAll: {
    position: 'absolute',
    right: '3rem',
    top: '2rem',
  },
}

class SearchResult extends React.Component {
  state = {
    list: [],
    curPage: 1,
    param: '',
  }
  data = []

  parsePath = pathname => {
    const match = /^\/search\/+([\d\w]+)(?:[/\s])*$/.exec(pathname)
    return match ? match[1] : null
  }

  loadPage = () => {
    document.documentElement.scrollIntoView()
    const { pathname } = this.props.location
    const param = this.parsePath(pathname)
    // '/search'重定向至'/archive'
    if (!param) {
      this.props.history.push('/archive')
      return
    }
    this.data = [
      {
        title:
          'mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记',
        readCount: 12,
        commentCount: 11,
        date: '2018-06-01',
        id: 1,
        link: `/blog/2018/06/01/mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记`,
      },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-13', id: 22 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-13', id: 23 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-13', id: 24 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-13', id: 21 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-13', id: 26 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-13', id: 28 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-13', id: 33 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-13', id: 32 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-13', id: 34 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-13', id: 66 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-12', id: 9 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-08', id: 11 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-01', id: 2 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2017-04-01', id: 3 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2016-05-01', id: 4 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2016-02-01', id: 5 },
    ]
    get(`/search/${param}`)
      .then(resp => {
        console.log(resp)
      })
      .catch(err => {
        fail(err)
      })
    this.setState({ list: this.data.slice(0, 10), param })
  }

  componentDidMount() {
    this.loadPage()
  }

  handlePageChange = page => {
    document.documentElement.scrollIntoView()
    const { history } = this.props
    history.push({ state: { page } })
    this.setState({
      curPage: page,
      list: this.data.slice(10 * page - 10, 10 * page),
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { page } = nextProps.history.location.state || { page: 1 }
    if (page !== prevState.curPage) {
      return {
        curPage: page,
      }
    }
    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.curPage !== this.state.curPage) {
      const { curPage } = this.state
      this.setState({ // eslint-disable-line
        list: this.data.slice(10 * curPage - 10, 10 * curPage),
      })
    }
  }
  render() {
    const { classes } = this.props
    const { curPage, list } = this.state
    return (
      <Detail>
        {/* <NoContent /> */}
        <div className={classes.checkAll}>
          <span>搜索关键字：{this.state.param}</span>
        </div>
        <div className={classes.root}>
          {list.map(item => <BlogListItem data={item} key={item.id} />)}
        </div>
        <Paging
          total={this.data.length}
          curPage={curPage}
          handlePageChange={this.handlePageChange}
        />
      </Detail>
    )
  }
}
export default injectSheet(styles)(SearchResult)
