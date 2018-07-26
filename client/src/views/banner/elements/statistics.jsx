import {
  React, injectSheet, Link, get, fail,
} from 'src/commonExports'

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

  async componentDidMount() {
    try {
      const data = await get('/statistics')
      this.setState({
        data,
      })
    } catch (e) {
      fail(e)
    }
  }

  render() {
    const { classes } = this.props
    const { data } = this.state
    return (
      <div className={classes.root}>
        <Link to="/list?archive=all">
          <div className={`plain-link ${classes.item}`}>
            <p>{data.blog}</p>
            <p>POST</p>
          </div>
        </Link>
        <Link to="/category">
          <div className={`plain-link ${classes.item}`}>
            <p>{data.category}</p>
            <p>CATEGORY</p>
          </div>
        </Link>
        <Link to="#">
          <div className={`plain-link ${classes.item}`}>
            <p>{data.label}</p>
            <p>LABEL</p>
          </div>
        </Link>
      </div>
    )
  }
}

export default injectSheet(styles)(Statistics)
