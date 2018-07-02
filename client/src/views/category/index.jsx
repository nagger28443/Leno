import React from 'react'
import injectSheet from 'react-jss'
import { Link } from 'react-router-dom'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { Detail } from '../../styledComponents'
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
}

@observer
class Category extends React.Component {
  @observable list = []
  @observable isAll = false // 当前是否为'全部分类'页面
  @observable curPage = 1
  data = []

  parsePath = pathname => {
    const match =
      /^\/category\/*$/.exec(pathname) || /^\/category\/+([\d\w]+)(?:[/\s])*$/.exec(pathname)
    return match ? { category: match[1] } : NOT_FOUND
  }

  @action
  loadPage = () => {
    document.documentElement.scrollIntoView()
    const { pathname } = this.props.location
    console.log(pathname)
    const params = this.parsePath(pathname)
    if (params === NOT_FOUND) {
      this.props.history.push('/404')
      return
    }
    this.isAll = !params.category
    get('/category', params)
      .then(
        action(resp => {
          console.log(resp)
        }),
      )
      .catch(err => {
        fail(err)
      })
    this.data = [
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-06-01', id: 1 },
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
    this.list = this.data.slice(0, 10)
  }

  @action
  componentDidMount() {
    this.loadPage()
  }

  shouldComponentUpdate() {
    this.loadPage()
  }
  @action
  handlePageChange = page => {
    document.documentElement.scrollIntoView()
    const { history } = this.props
    history.push({ state: { page } })
    this.curPage = page
    this.list = this.data.slice(10 * page - 10, 10 * page)
  }
  @action
  componentWillReceiveProps(nextProps) {
    const { page } = nextProps.history.location.state || { page: 1 }
    if (page !== this.curPage) {
      this.curPage = page
      this.archives = this.dataFormat(this.data.slice(10 * page - 10, 10 * page))
    }
  }
  render() {
    const { classes } = this.props
    return (
      <Detail>
        <div style={{ display: this.isAll ? 'none' : 'block' }}>
          <span>当前分类：</span>
          <Link to="/category">查看全部</Link>
        </div>
        <div className={classes.root}>
          {this.list.map(item => <BlogListItem data={item} key={item.id} />)}
        </div>
        <Paging
          total={this.data.length}
          curPage={this.curPage}
          handlePageChange={this.handlePageChange}
        />
      </Detail>
    )
  }
}
export default injectSheet(styles)(Category)
