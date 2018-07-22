import {
  React, injectSheet, inject, observer, get, action, fail,
} from 'src/commonExports'

const styles = {
  categories: {
    display: 'inline-block',
    position: 'relative',
    zIndex: 10,
  },
  dropdown: {
    background: '#f5f5f5',
    width: '10rem',
    position: 'absolute',
    top: '2rem',
    left: 0,
  },
  category: {
    height: '1.3rem',
    cursor: 'pointer',
  },
}

let store

@inject('blogEditorStore')
@observer
class Category extends React.Component {
  constructor(props) {
    super(props)
    store = props.blogEditorStore
    this.allCategories = []
    this.state = {
      categories: [],
      isDropdownVisible: false,
    }
  }

  handleInputFocus = () => {
    this.setState({ isDropdownVisible: true })
  }

  handleInputBlur = () => {
    setTimeout(() => {
      this.setState({ isDropdownVisible: false })
    }, 100)
  }

  @action
  handleInputChange = e => {
    const value = e.target.value.trim()
    store.category = value
    const inputRegex = new RegExp(`.*${value}.*`, 'i')
    const categories = this.allCategories.filter(c => inputRegex.test(c.name))
    this.setState({ categories })
  }

  @action
  handleInputConfirm = e => {
    store.category = e.target.innerText
  }

  fetchCategories = () => {
    get('/category/list')
      .then(resp => {
        this.allCategories = resp.result
        this.setState({ categories: resp.result })
      })
      .catch(err => {
        fail(err)
      })
  }

  componentDidMount() {
    this.fetchCategories()
  }

  render() {
    const { classes } = this.props
    const { categories, isDropdownVisible } = this.state

    return (
      <div>
        <span>个人分类：</span>
        <span>
          <div className={classes.categories}>
            <input
              type="text"
              placeholder="搜索或添加分类"
              className="input-box"
              style={{ width: '10rem' }}
              onFocus={this.handleInputFocus}
              onBlur={this.handleInputBlur}
              onChange={this.handleInputChange}
              value={store.category}
            />
            <div
              className={`input-box ${classes.dropdown}`}
              style={{ display: isDropdownVisible ? 'block' : 'none' }}
            >
              {categories.map(c => (
                <div className={classes.category} key={c.id} onClick={this.handleInputConfirm}>
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </span>
      </div>
    )
  }
}

export default injectSheet(styles)(Category)
