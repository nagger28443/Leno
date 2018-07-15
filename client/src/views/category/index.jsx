import React from 'react'
import injectSheet from 'react-jss'
import { Link } from 'react-router-dom'
import { Detail } from '../../styledComponents'
import { get } from '../../util/http'
import { fail } from '../../util/utils'

const styles = {
  header: {
    textAlign: 'center',
  },
  category: {
    margin: '1rem',
  },
}

class Category extends React.Component {
  state = {
    list: [],
  }

  componentDidMount() {
    document.documentElement.scrollIntoView()
    get('/category/list')
      .then(resp => {
        this.setState({
          list: resp.result,
        })
      })
      .catch(err => {
        fail(err)
      })
  }

  render() {
    const { classes } = this.props
    const { list } = this.state
    return (
      <Detail>
        <h1 className={classes.header}>分类列表</h1>
        {list.map(item => (
          <Link
            to={`/list?category=${item.name}`}
            key={item.id}
            className={`link ${classes.category}`}>
            {item.name}({item.count})
          </Link>
        ))}
      </Detail>
    )
  }
}
export default injectSheet(styles)(Category)
