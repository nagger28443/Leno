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
        <Link to={`/list?category=${data.category}`} className="link">
          {data.category}
        </Link>
      </span>
      <span>
        标签：
        {data.labels.split(',').map((item, index, record) => (
          /* eslint-disable */ 
          <React.Fragment key={index}>
            <Link to={`/list?labels=${item}`} className="link" key={item} style={{}}>
              {item}
            </Link>
            {index === record.length - 1 ? '' : '，'}
          </React.Fragment>
          /* eslint-enable */
        ))}
      </span>
    </p>
  </div>
)
export default injectSheet(styles)(BlogHeader)
