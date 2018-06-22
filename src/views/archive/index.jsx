import React from 'react'
import injectSheet from 'react-jss'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { Detail } from '../../styledComponents'
import BlogListItem from '../commonComponents/blogListItem'
import { get } from '../../util/http'
import { fail } from '../../util/utils'

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

@observer
class Archive extends React.Component {
  @observable archives = []

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

  @action
  componentDidMount() {
    document.documentElement.scrollIntoView()
    const { pathname } = this.props.location
    const date = pathname
      .split('/')
      .slice(-2)
      .join('-')
    get('/demo', { date })
      .then(
        action(resp => {
          console.log(resp)
        }),
      )
      .catch(err => {
        fail(err)
      })
    const data = [
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-06-01', id: 1 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-13', id: 66 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-12', id: 9 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-08', id: 11 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-01', id: 2 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2017-04-01', id: 3 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2016-05-01', id: 4 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2016-02-01', id: 5 },
    ]
    this.archives = this.dataFormat(data)
  }
  render() {
    console.log(this.archives.slice())
    const { classes } = this.props
    return (
      <Detail>
        <div className={classes.root}>
          {this.archives.map(item => (
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
