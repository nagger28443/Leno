import React from 'react'
import injectSheet from 'react-jss'
import { Detail } from '../../styledComponents'
import BlogListItem from '../commonComponents/blogListItem'
import { get } from '../../util/http'
import { fail } from '../../util/utils'
import Paging from '../commonComponents/paging'
import { NOT_FOUND } from '../../constants'
import f from '../../util/f'

const styles = {
  root: {
    position: 'relative',
    paddingLeft: '2rem',
    '&:before': {
      content: '""',
      height: '100%',
      width: '0.2rem',
      position: 'absolute',
      left: 0,
      top: '0.4rem',
      background: '#e5e3e3',
    },
  },
  mark: {
    position: 'relative',
    '&:hover:before': {
      background: '#af75d8fc',
    },
    '&:before': {
      content: '""',
      height: '0.6rem',
      width: '0.6rem',
      borderRadius: '50%',
      position: 'absolute',
      left: '-2.2rem',
      top: '0.4rem',
      background: '#b6b4b4',
    },
  },
  year: {
    fontSize: 'x-large',
    margin: ['2rem', 0],
  },
  month: {
    fontSize: 'larger',
    margin: ['1rem', 0],
  },
}

class Archive extends React.Component {
  state = {
    archives: [],
    curPage: 1,
  }
  data = []

  dataFormat = data => {
    let preYear = null
    let preMonth = null
    const res = []
    data.forEach(item => {
      const date = new Date(item.date)
      const yy = date.getFullYear()
      const mm = date.getMonth() + 1
      if (yy !== preYear) {
        preYear = yy
        preMonth = mm
        res.push({ year: yy, data: [] })
        res[res.length - 1].data.push({ month: mm, data: [{ data: item }] })
      } else if (mm !== preMonth) {
        preMonth = mm
        const t = res[res.length - 1].data
        t.push({ month: mm, data: [] })
        t[t.length - 1].data.push({ data: item })
      } else {
        const t = res[res.length - 1].data
        t[t.length - 1].data.push({ data: item })
      }
    })
    return res
  }

  checkDateValid = ({ year, month }) =>
    (year === undefined && month === undefined) ||
    (month === undefined && f.isYear(year)) ||
    (f.isMonth(month) && f.isYear(year))

  parsePath = pathname => {
    const match =
      /^\/archive\/+(\d+)\/+(\d+)(?:[/\s])*$/.exec(pathname) ||
      /^\/archive\/+(\d+)(?:[/\s])*$/.exec(pathname) ||
      /^\/archive(?:[/\s])*$/.exec(pathname)
    return match && this.checkDateValid({ year: match[1], month: match[2] })
      ? { year: match[1], month: match[2] }
      : NOT_FOUND
  }

  componentDidMount() {
    document.documentElement.scrollIntoView()
    const { pathname } = this.props.location
    const params = this.parsePath(pathname)
    if (params === NOT_FOUND) {
      this.props.history.push('/404')
      return
    }
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
    get('/blogList', { x: undefined })
      .then(resp => {
        console.log(resp)
      })
      .catch(err => {
        fail(err)
      })
    this.setState({ // eslint-disable-line
      archives: this.dataFormat(this.data.slice(0, 10)),
    })
  }
  handlePageChange = page => {
    document.documentElement.scrollIntoView()
    const { history } = this.props
    history.push({ state: { page } })
    this.setState({
      curPage: page,
      archives: this.dataFormat(this.data.slice(10 * page - 10, 10 * page)),
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
        archives: this.data.slice(10 * curPage - 10, 10 * curPage),
      })
    }
  }
  render() {
    const { classes } = this.props
    const { curPage, archives } = this.state
    return (
      <Detail>
        <div className={classes.root}>
          {archives.map(item => (
            <div className={classes.mark} key={item.data.id}>
              <p className={classes.year}>{item.year}年</p>
              {item.data.map(ele => (
                <div className={classes.mark} key={ele.data.id}>
                  <p className={classes.month}>{ele.month}月</p>
                  {ele.data.map(d => <BlogListItem data={d.data} key={d.data.id} />)}
                </div>
              ))}
            </div>
          ))}
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
export default injectSheet(styles)(Archive)
