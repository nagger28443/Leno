import React from 'react'
import { Link } from 'react-router-dom'
import injectSheet from 'react-jss'

const styles = {
  title: {
    fontSize: 'x-large',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  info: {
    fontSize: 'smaller',
    textAlign: 'center',
    '& span': {
      margin: [0, '0.5rem'],
    },
  },
}
const BlogHeader = ({ classes, data }) => (
  <div>
    <header className={classes.title}>{data.title}</header>
    <p className={classes.info}>
      <span>发表于：{data.date}</span>
      <span>
        分类：
        <Link to="/category/coding" className="link">
          {data.category}
        </Link>
      </span>
      <span>
        标签：
        {data.tags.map(item => (
          <Link to="/label/React" className="link" key={item}>
            {item}
          </Link>
        ))}
      </span>
    </p>
  </div>
)
export default injectSheet(styles)(BlogHeader)
