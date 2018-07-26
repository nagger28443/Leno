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

  getBlogPath = data => `/blog/${data.date.slice(0, 10).split('-').join('/')}/${data.title}`

  getDraftPath = data => `/admin/draft/edit/${data.id}`

  render() {
    const {
      classes, data, isDraft, isAdmin,
    } = this.props
    const path = isDraft ? this.getDraftPath(data) : this.getBlogPath(data)
    return (
      <div className={classes.root}>
        <Link
          to={path}
          className="plain-link"
          target={`${isAdmin ? '_blank' : '_self'}`}
        >
          <p className={classes.title}>{data.title}</p>
        </Link>
        <div className={classes.footer}>
          <span>{data.date}</span>
          {data.visitCount ? <span>Read：{data.visitCount}</span> : ''}
          <span>Category：{data.category}</span>
        </div>
      </div>
    )
  }
}
export default injectSheet(styles)(Item)
