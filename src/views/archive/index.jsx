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
      background: 'red',
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
}

@observer
class Archive extends React.Component {
  @observable archives = []

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
    this.archives = [
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-06-01', id: 1 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-08', id: 9 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2018-04-01', id: 2 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2017-04-01', id: 3 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2016-05-01', id: 4 },
      { title: 'mobx踩坑记', readCount: 12, commentCount: 11, date: '2016-02-01', id: 5 },
    ]
  }
  render() {
    console.log(this.props)
    const { classes } = this.props
    let preYear = null
    let preMonth = null
    return (
      <Detail>
        <div className={classes.root}>
          {this.archives.map(item => {
            const date = new Date(item.date)
            const yy = date.getFullYear()
            const mm = date.getMonth() + 1
            if (yy !== preYear) {
              preYear = yy
              preMonth = mm
              return (
                <React.Fragment>
                  <p className={classes.mark}>{yy}年</p>
                  <p className={classes.mark}>{mm}月</p>
                  <BlogListItem data={item} key={item.id} />
                </React.Fragment>
              )
            } else if (mm !== preMonth) {
              preMonth = mm
              return (
                <React.Fragment>
                  <p className={classes.mark}>{mm}月</p>
                  <BlogListItem data={item} key={item.id} />
                </React.Fragment>
              )
            }
            return <BlogListItem data={item} key={item.id} />
          })}
        </div>
      </Detail>
    )
  }
}
export default injectSheet(styles)(Archive)
