import { React, injectSheet, Link, get, fail} from 'src/commonExports' //eslint-disable-line

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
  state = {
    data: {},
  }

  componentDidMount() {
    get('/statistics')
      .then(resp => {
        this.setState({
          data: resp,
        })
      })
      .catch(err => {
        fail(err)
      })
  }

  render() {
    const { classes } = this.props
    const { data } = this.state
    return (
      <div className={classes.root}>
        <Link to="/list?archive=all">
          <div className={`plain-link ${classes.item}`}>
            <p>{data.blog}</p>
            <p>日志</p>
          </div>
        </Link>
        <Link to="/category">
          <div className={`plain-link ${classes.item}`}>
            <p>{data.category}</p>
            <p>分类</p>
          </div>
        </Link>
        <Link to="#">
          <div className={`plain-link ${classes.item}`}>
            <p>{data.label}</p>
            <p>标签</p>
          </div>
        </Link>
      </div>
    )
  }
}

export default injectSheet(styles)(Statistics)
