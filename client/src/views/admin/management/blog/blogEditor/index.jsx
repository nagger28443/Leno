import {
  React, injectSheet, inject, observer, get, post, fail, put, action, runInAction,
} from 'src/commonExports'
import { Button, Input } from 'src/echo'
import TextArea from 'src/views/commonComponents/textarea'
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
    this.state = {
      // isDraft: false,
    }
  }

  @action
  handleTitleChange = value => {
    store.title = value
  }

  @action
  handleContentChange = value => {
    store.content = value
  }

  postBlog = () => {
    const { title, content } = store

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
    store.id = this.props.match.params.id
    if (store.id !== 'new' && /^\d+$/.test(store.id)) {
      const data = await get('/draft', { id: store.id })
      runInAction(() => {
        Object.assign(store, data, { labels: data.labels.split(',') })
      })
    } else {
      this.props.history.push('/admin/404')
    }
  }

   saveDraft = async () => {
     const {
       id, title, content, category, labels, isPrivate,
     } = store
     const data = {
       title,
       content,
       category,
       labels: labels.join(','),
       isPrivate,
     }
     if (id !== 'new') {
       const result = await put('/draft', { ...data, id })
       console.log(result)
     } else {
       const result = await post('/draft', data)
       console.log(result)
     }
   }

   render() {
     const { classes } = this.props
     const { title, content } = store
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
             value={title}
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
             value={content}
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
