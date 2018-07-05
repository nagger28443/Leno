import React from 'react'
import injectSheet from 'react-jss'
import { Link } from 'react-router-dom'

const styles = {
  root: {
    margin: ['2rem', 0],
  },
  item: {
    display: 'inline-block',
    textAlign: 'center',
    margin: [0, '1rem', 0, 0],
    '& p': {
      margin: ['0.2rem', 0],
    },
    color: '#555',
  },
}

class Statistics extends React.Component {
  componentDidMount() {}
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Link to="/archive">
          <div className={`plain-link ${classes.item}`}>
            <p>10</p>
            <p>日志</p>
          </div>
        </Link>
        <Link to="/category">
          <div className={`plain-link ${classes.item}`}>
            <p>12</p>
            <p>分类</p>
          </div>
        </Link>
        <Link to="#">
          <div className={`plain-link ${classes.item}`}>
            <p>19</p>
            <p>标签</p>
          </div>
        </Link>
      </div>
    )
  }
}

export default injectSheet(styles)(Statistics)
