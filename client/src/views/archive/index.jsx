import { React, injectSheet, _, get, fail, f } from 'src/commonExports' //eslint-disable-line
import { Detail } from '../../styledComponents'
import BlogListItem from '../commonComponents/blogListItem'
import { NOT_FOUND } from '../../constants'

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
    query: '',
  }
  totalCount = 0
  curPage = 0

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

  getData = () => {
    const { pathname } = this.props.location
    const query = this.parsePath(pathname)
    if (query === NOT_FOUND) {
      this.props.history.push('/404')
      return
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
          archives: [...this.state.archives, ...resp.result],
        })
      })
      .catch(err => {
        fail(err)
      })
  }

  componentDidMount() {
    document.documentElement.scrollIntoView()
    this.scrollListener = _.throttle(this.handleScroll(), 500)
    window.addEventListener('scroll', this.scrollListener, false)
    this.getData()
  }

  render() {
    const { classes } = this.props
    const { archives, query } = this.state
    console.log(query)
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
      </Detail>
    )
  }
}
export default injectSheet(styles)(Archive)
