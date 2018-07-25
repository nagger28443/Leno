import {
  React, injectSheet, fail, put,
} from 'src/commonExports'
import { Button, Input } from 'src/echo'
import { get } from 'src/util/http'


const styles = {
  header: {
    // textAlign: 'right',
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
    this.input = {}
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
          curId: null,
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
    if (this.input.validate(this.inputValue)) {
      const res = window.confirm(`如果分类“${this.inputValue}”之前已存在，将会合并两个分类的文章。`)
      if (!res) return

      const { curId } = this.state
      await put('/category', { id: curId, name: this.inputValue })
      this.getCategories()
    }
  }

  handleCancel = () => {
    this.setState({
      curId: null,
    })
  }

  handleClick = (e) => {
    const id = e.target.getAttribute('data-id')
    const { modifying } = this.state
    if (modifying) {
      this.inputValue = this.state.categories.find(item => String(item.id) === id).name
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
        <hr className="hr" />
        <div className={classes.content}>
          {categories.map(item => (
            <span className={classes.category}>
              {
                curId === String(item.id) && modifying
                  ? (
                    <span>
                      <Input
                        autoFocus
                        bridge={this.input}
                        defaultValue={item.name}
                        rules={[
                          { required: true, message: '分类名称不能为空' },
                          { max: 20, message: '分类名称长度不可超过20' },
                        ]}
                        onChange={this.handleInputChange}
                      />
                      <span
                        onClick={this.updateCategory}
                        className="plain-link"
                        style={{ fontSize: 'smaller', marginLeft: '1rem' }}
                      >
                       保存
                      </span>
                      <span
                        onClick={this.handleCancel}
                        className="plain-link"
                        style={{ fontSize: 'smaller', marginLeft: '1rem' }}
                      >
                       取消
                      </span>
                    </span>
                  )
                  : (
                    <span
                      data-id={item.id}
                      key={item.id}
                      onClick={this.handleClick}
                      className={modifying ? 'link' : 'plain-link '}
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
