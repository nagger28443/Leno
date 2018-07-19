import { React, injectSheet,inject, observer, get, post, put, fail } from 'src/commonExports' //eslint-disable-line
import Labels from './labels'
import Category from './category'
import PrivateSwitch from './privateSwitch'
import Button from '../../../../commonComponents/button'
import blog from '../../../../../blogs/2.md'

const styles = {
  row: {
    margin: '1rem',
  },

  title: {
    width: '100%',
  },
  content: {
    width: '100%',
    height: '30rem',
    lineHeight: 1.7,
    padding: '1rem',
  },
  label: {
    margin: [0, '0.3rem'],
    cursor: 'pointer',
  },
}

let store
@inject('blogEditorStore')
@observer
class BlogEditor extends React.Component {
  constructor(props) {
    super(props)
    store = props.blogEditorStore
    this.title = ''
    this.content = ''
    this.state = {}
  }

  handleTitleChange = e => {
    this.title = e.target.value
  }
  handleContentChange = e => {
    this.content = e.target.value
  }

  postBlog = () => {
    const { title, content } = this
    const { labels, category, isPrivate } = store
    post('/blog', { title, content, labels: labels.join(','), category, isPrivate }).catch(err => {
      fail(err)
    })
  }

  componentDidMount() {}
  render() {
    const { classes } = this.props
    // const { } = this.state
    return (
      <div className={classes.root}>
        <div className={classes.row}>
          <input
            type="text"
            placeholder="请输入文章标题"
            className={`input-box ${classes.title}`}
            onChange={this.handleTitleChange}
          />
        </div>
        <div className={classes.row}>
          <textarea
            cols="30"
            rows="10"
            required
            className={`input-box ${classes.content}`}
            defaultValue={blog}
            onChange={this.handleContentChange}
          />
        </div>
        <div style={{ fontSize: 'small' }}>
          <div className={classes.row}>
            <Labels />
          </div>
          <div className={classes.row}>
            <Category />
          </div>
          <div className={classes.row}>
            <PrivateSwitch />
          </div>
          <div className={classes.row}>
            <span style={{ visibility: 'hidden' }}>提交按钮：</span>
            <Button style={{ marginRight: '0.5rem' }} text="发表博客" onClick={this.postBlog} />
            <Button text="保存草稿" onClick={this.saveDraft} />
          </div>
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(BlogEditor)
