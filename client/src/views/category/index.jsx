import React from 'react'
import injectSheet from 'react-jss'
import { Link } from 'react-router-dom'
import { Detail } from '../../styledComponents'
import { get } from '../../util/http'
import { observable, observer, runInAction } from '../../commonExports'

const styles = {
  header: {
    textAlign: 'center',
  },
  category: {
    margin: '1rem',
  },
}

@observer
class Category extends React.Component {
   @observable list= []

  @observable isLoading= true

  async componentDidMount() {
    document.documentElement.scrollIntoView()
    const resp = await get('/category/list')
    runInAction(() => {
      this.list = resp.result
      this.isLoading = false
    })
  }

  render() {
    const { classes } = this.props
    const { list, isLoading } = this
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
