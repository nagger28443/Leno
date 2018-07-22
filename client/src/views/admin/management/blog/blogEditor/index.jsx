import {
  React, injectSheet, inject, observer, get, post, fail,
} from 'src/commonExports'
import { Button, Input } from 'src/echo'
import TextArea from 'src/views/commonComponents/textarea'
import blog from 'src/blogs/2.md'
import Labels from './labels'
import Category from './category'
import PrivateSwitch from './privateSwitch'

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
    this.titleInput = {}
    this.contentInput = {}
    this.title = ''
    this.content = ''
    this.state = {
      // isDraft: false,
    }
  }

  handleTitleChange = value => {
    this.title = value
  }

  handleContentChange = value => {
    this.content = value
  }

  postBlog = () => {
    const { title, content } = this

    if (
      !this.titleInput.validate(title)
      || !this.contentInput.validate(content)
      || store.category.length === 0
    ) {
      return
    }

    const { labels, category, isPrivate } = store
    post('/blog', {
      title, content, labels: labels.join(','), category, isPrivate,
    }).catch(err => {
      fail(err)
    })
  }

  async componentDidMount() {
    this.id = this.props.match.params.id
    if (this.id !== 'new' && /^\d+$/.test(this.id)) {
      const data = await get('/draft', { id: this.id })
      console.log(data)
    }
  }

   saveDraft = async () => {
     // const { id, title, content } = this
     // const { category, labels, isPrivate } = store
     // const data = {
     //   title,
     //   content,
     //   category,
     //   labels: labels.join(','),
     //   isPrivate,
     // }
     // if (id) {
     //   const result = await put('/draft', { ...data, id })
     // } else {
     //   const result = await post('/draft', data)
     // }
   }

   render() {
     const { classes } = this.props
     const { title } = store
     return (
       <div className={classes.root}>
         <div className={classes.row}>
           <Input
             bridge={this.titleInput}
             rules={[
               { max: 50, message: '标题长度不能超过50' },
               { min: 2, message: '标题长度不能小于2' },
             ]}
             className={classes.title}
             onChange={this.handleTitleChange}
             defaultValue={title}
             placeholder="请输入文章标题"
           />
         </div>
         <div className={classes.row}>
           <TextArea
             bridge={this.contentInput}
             rules={[
               { required: true, message: '内容不能为空' },
               { max: 20000, message: '标题长度不能超过20000字' },
             ]}
             className={classes.content}
             defaultValue={blog}
             onChange={this.handleContentChange}
             placeholder="请输入文章内容"
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
