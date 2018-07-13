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
    params: '',
  }
  data = []

  loadPage = ({ pageNum = 1, pageSize = 10 }) => {
    document.documentElement.scrollIntoView()
    const { params } = this.props.match.params
    get('/blog/list', {
      search: params,
      pageSize,
      pageNum,
    })
      .then(resp => {
        this.setState({
          list: resp.data,
        })
      })
      .catch(err => {
        fail(err)
      })
    this.data = [
      {
        title: 'mobx踩坑记mobx踩坑记m',
        readCount: 12,
        date: '2018-06-01',
        id: 1,
        link: `/blog/2018/06/01/mobx踩坑记m`,
      },
    ]

    this.setState({ list: this.data.slice(0, 10), params })
  }

  componentDidMount() {
    this.loadPage({})
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
    const { curPage, list, params } = this.state
    return (
      <Detail>
        {/* <NoContent /> */}
        <div className={classes.checkAll}>
          <span>搜索关键字：{params.replace(' ', ',')}</span>
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
