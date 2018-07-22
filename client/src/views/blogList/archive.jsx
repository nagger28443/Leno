import {
  React, injectSheet, inject, autorun,
} from 'src/commonExports'
import BlogListItem from '../commonComponents/blogListItem'

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

const dataFormat = data => {
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
@inject('blogListStore')
class Archive extends React.Component {
  data = []

  updateArchives = () => {
    this.data = dataFormat(this.props.blogListStore.data)
  }

  disposer = autorun(this.updateArchives)

  componentWillUnmount() {
    this.disposer()
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        {this.data.map(item => (
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
    )
  }
}
export default injectSheet(styles)(Archive)
