import React from 'react'
import injectSheet from 'react-jss'
import { Link } from 'react-router-dom'

const styles = {
  root: {
    marginBottom: '2.3rem',
  },
  title: {
    position: 'relative',
    padding: ['0.2rem', '1rem'],
    '&:before': {
      position: 'absolute',
      top: '10%',
      left: 0,
      width: '0.3rem',
      height: '80%',
      background: '#922d078c',
      content: '""',
    },
  },
  item: {
    lineHeight: 1,
  },
  link: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  count: {
    fontSize: 'smaller',
    float: 'right',
  },
  all: {
    fontSize: 'smaller',
    display: 'inline-block',
    float: 'right',
    marginTop: '-0.3rem',
  },
}

const CardTemplate = ({ classes, data }) => (
  <div className={classes.root}>
    <header className={classes.title}>{data.title}</header>
    {data.content.map(item => (
      <p key={item.key} className={classes.item}>
        <Link to={item.link} replace className={`plain-link ${classes.link}`}>
          {item.name}
        </Link>
        <span className={classes.count}>{item.count}</span>
      </p>
    ))}
    <Link to={data.all} className={`plain-link ${classes.all}`}>
      MORE
    </Link>
  </div>
)

export default injectSheet(styles)(CardTemplate)
