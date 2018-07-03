import React from 'react'
import injectSheet from 'react-jss'
import { Link } from 'react-router-dom'
import { Detail } from '../../styledComponents'
// import NoContent from '../commonComponents/noContent'
import BlogListItem from '../commonComponents/blogListItem'
import { get } from '../../util/http'
import { fail } from '../../util/utils'
import Paging from '../commonComponents/paging'
import { NOT_FOUND } from '../../constants'

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

class Category extends React.Component {
  state = {
    list: [],
    curPage: 1,
  }
  data = []

  parsePath = pathname => {
    const match =
      /^\/category\/*$/.exec(pathname) || /^\/category\/+([\d\w]+)(?:[/\s])*$/.exec(pathname)
    return match ? { category: match[1] } : NOT_FOUND
  }

  loadPage = () => {
    document.documentElement.scrollIntoView()
    const { pathname } = this.props.location
    const params = this.parsePath(pathname)
    if (params === NOT_FOUND) {
      this.props.history.push('/404')
      return
    }
    get('/category', params)
      .then(resp => {
        console.log(resp)
      })
      .catch(err => {
        fail(err)
      })
    this.data = [
      {
        title:
          'mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记mobx踩坑记',
        readCount: 12,
        commentCount: 11,
        date: '2018-06-01',
        id: 1,
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
    this.setState({ list: this.data.slice(0, 10) })
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
    console.log(123)
    const { classes } = this.props
    const { curPage, list } = this.state
    return (
      <Detail>
        {/* <NoContent /> */}
        <div
          className={classes.checkAll}
          style={{ display: this.props.location.pathname === '/category' ? 'none' : 'block' }}>
          <span>当前分类：{}</span>
          <Link to="/category" className="plain-link ">
            查看全部
          </Link>
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
export default injectSheet(styles)(Category)
