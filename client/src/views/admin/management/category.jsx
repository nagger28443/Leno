import {
  React, injectSheet, fail,
} from 'src/commonExports'
import { Button } from 'src/echo'
import { get } from 'src/util/http'


const styles = {
  header: {
    // textAlign: 'right',
  },
  hr: {
    border: 0,
    height: 1,
    background: '#ababab',
    margin: [15, 0],
  },
  content: {

  },
  category: {
    margin: '1rem',
  },
}

const STATUS = {
  rename: Symbol('rename'),
  dele: Symbol('delete'),
}

class Category extends React.Component {
  constructor(props) {
    super(props)
    this.status = null
    this.state = {
      categories: [],
    }
  }

  componentDidMount() {
    document.documentElement.scrollIntoView()
    get('/category/list')
      .then(resp => {
        this.setState({
          categories: resp.result,
        })
      })
      .catch(err => {
        fail(err)
      })
  }

  toRename = () => {
    this.status = STATUS.rename
  }

  toDelete = () => {
    this.status = STATUS.dele
  }

  handleDelete = (id) => {
    console.log('delete', id)
  }

  handleRename = (id) => {
    console.log('rename', id)
  }

  handleClick = (e) => {
    const id = e.target.getAttribute('data-id')
    if (this.status === STATUS.dele) {
      this.handleDelete(id)
    } else if (this.status === STATUS.rename) {
      this.handleRename(id)
    }
  }

  render() {
    const { classes } = this.props
    const { categories } = this.state
    return (
      <div>
        <div className={classes.header}>
          <Button text="重命名" style={{ fontSize: 'smaller', marginRight: 10 }} onClick={this.toRename} />
          <Button text="删除" style={{ fontSize: 'smaller' }} onClick={this.toDelete} />
        </div>
        <hr className={classes.hr} />
        <div className={classes.content}>
          {categories.map(item => (
            <span
              data-id={item.id}
              key={item.id}
              className={`link ${classes.category}`}
              onClick={this.handleClick}
            >
              {item.name}({item.count})
            </span>
          ))}
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Category)
