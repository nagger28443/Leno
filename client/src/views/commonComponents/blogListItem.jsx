import React from 'react'
import injectSheet from 'react-jss'
import { Link } from 'react-router-dom'

const styles = {
  root: {
    borderBottom: ['dashed', 1, '#bbb7b7'],
    paddingBottom: '0.5rem',
    lineHeight: 1.6,
  },
  title: {
    fontSize: 'larger',
    marginBottom: '0.5rem',
  },
  footer: {
    fontSize: 'smaller',
    '& span': {
      display: 'inline-block',
      marginRight: '1rem',
    },
  },
}

class Item extends React.Component {
  handleClick = () => {}

  getPath = data => `${data.date.split('-').join('/')}/${data.title}`

  render() {
    const { classes, data } = this.props
    const path = this.getPath(data)
    return (
      <div className={classes.root}>
        <Link to={`/blog/${path}`} className="plain-link">
          <p className={classes.title}>{data.title}</p>
        </Link>
        <div className={classes.footer}>
          <span>{data.date}</span>
          <span>阅读数：{data.visitCount}</span>
          {/* <span>评论数：{data.commentCount}</span> */}
        </div>
      </div>
    )
  }
}
export default injectSheet(styles)(Item)
