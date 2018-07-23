import {
  React, injectSheet, fail, f, put,
} from 'src/commonExports'
import { Button, Input } from 'src/echo'
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
  active: {
    borderColor: 'red',
  },
}


class Category extends React.Component {
  constructor(props) {
    super(props)
    this.inputValue = ''
    this.state = {
      categories: [],
      modifying: false,
      curId: null,
    }
  }

  getCategories = () => {
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

  componentDidMount() {
    document.documentElement.scrollIntoView()
    this.getCategories()
  }

  toRename = () => {
    const { modifying } = this.state
    this.setState({
      modifying: !modifying,
    })
  }

  handleInputChange=value => {
    this.inputValue = value
  }

  // 逻辑有问题, todo
  updateCategory = async () => {
    if (!f.isEmpty(this.inputValue)) {
      const res = window.confirm(`如果分类“${this.inputValue}”之前已存在，将会合并两个分类的文章。`)
      if (!res) return

      const { curId } = this.state
      await put('/category', { id: curId, name: this.inputValue })
      this.getCategories()
    }
    this.setState({ curId: null })
  }

  handleClick = (e) => {
    const id = e.target.getAttribute('data-id')
    const { modifying } = this.state
    if (modifying) {
      this.setState({
        curId: id,
      })
    }
  }

  render() {
    const { classes } = this.props
    const { categories, modifying, curId } = this.state
    return (
      <div>
        <div className={classes.header}>
          <Button
            text="重命名"
            style={{
              fontSize: 'smaller',
              marginRight: 10,
              backgroundColor: modifying ? '#6c757d' : '#fff',
              color: modifying ? '#fff' : '#6c757d',
            }}
            onClick={this.toRename}
          />
        </div>
        <hr className={classes.hr} />
        <div className={classes.content}>
          {categories.map(item => (
            <span className={`plain-link ${classes.category}`}>
              {
                curId === String(item.id) && modifying
                  ? (
                    <Input
                      autoFocus
                      defaultValue={item.name}
                      onBlur={this.updateCategory}
                      onChange={this.handleInputChange}
                    />
                  )
                  : (
                    <span
                      data-id={item.id}
                      key={item.id}
                      onClick={this.handleClick}
                    >
                      {item.name}({item.count})
                    </span>
                  )
              }
            </span>
          ))}
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Category)
