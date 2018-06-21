import React from 'react'
import injectSheet from 'react-jss'

const styles = {
  root: {
    borderBottom: ['dashed', 1, '#bbb7b7'],
    paddingBottom: '0.5rem',
  },
  title: {
    fontSize: 'larger',
    lineHeight: 0.5,
  },
  footer: {
    fontSize: 'smaller',
    '& span': {
      display: 'inline-block',
      marginRight: '1rem',
    },
  },
}

const Item = ({ classes, data }) => (
  <div className={classes.root}>
    <p className={classes.title}>{data.title}</p>
    <div className={classes.footer}>
      <span>{data.date}</span>
      <span>阅读数：{data.readCount}</span>
      <span>评论数：{data.commentCount}</span>
    </div>
  </div>
)

export default injectSheet(styles)(Item)
