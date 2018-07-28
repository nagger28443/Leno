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
    isLoading: true,
  }

  async componentDidMount() {
    document.documentElement.scrollIntoView()
    try {
      const resp = await get('/category/list')
      this.setState({
        list: resp.result,
        isLoading: false,
      })
    } catch (e) {
      fail(e)
    }
  }

  render() {
    const { classes } = this.props
    const { list, isLoading } = this.state
    if (isLoading) {
      return <Detail><div className="loading" /></Detail>
    }
    return (
      <Detail>
        <h1 className={classes.header}>Category List</h1>
        {list.map(item => (
          <Link
            to={`/list?category=${item.name}`}
            key={item.id}
            className={`link ${classes.category}`}
          >
            {item.name}({item.count})
          </Link>
        ))}
      </Detail>
    )
  }
}
export default injectSheet(styles)(Category)
