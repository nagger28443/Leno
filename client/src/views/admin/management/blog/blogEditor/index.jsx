import {
  React, injectSheet, inject, observer, get, post, put, action, runInAction, fail, dele,
} from 'src/commonExports'
import { Button, Input } from 'src/echo'
import TextArea from 'src/views/commonComponents/textarea'
import Labels from './labels'
import Category from './category'
import PrivateSwitch from './privateSwitch'
import message from '../../../../../echo/message'

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
    this.state = {}
  }

  @action
  handleTitleChange = value => {
    store.title = value
  }

  @action
  handleContentChange = value => {
    store.content = value
  }

  postBlog = async () => {
    const { title, content } = store

    if (
      !this.titleInput.validate(title)
      || !this.contentInput.validate(content)
      || store.category.length === 0
    ) {
      return
    }

    const {
      labels, category, isPrivate, draftId,
    } = store
    try {
      await post('/blog', {
        title, content, labels: labels.join(','), category, isPrivate,
      })
      if (draftId) {
        await dele('/draft', { id: draftId })
      }

      message.info('发表成功')
      this.props.history.push('/admin/blog/list')
    } catch (e) {
      fail(e)
    }
  }

  @action
  async componentDidMount() {
    const { id } = this.props.match.params
    const { isDraft } = this.props
    if (id === 'new') return
    if (isDraft) {
      try {
        const data = await get('/draft', { id })
        runInAction(() => {
          store.draftId = id
          Object.assign(store, data, { labels: data.labels.split(',') })
        })
      } catch (e) {
        fail(e)
      }
    } else {
      store.blogId = id
    }
  }

  @action
  componentWillUnmount() {
    Object.assign(store, {
      blogId: null,
      draftId: null,
      title: '',
      content: '',
      labels: [],
      category: '',
      isPrivate: false,
    })
  }

   saveDraft = async () => {
     const {
       draftId, title, content, category, labels, isPrivate,
     } = store
     const data = {
       title,
       content,
       category,
       labels: labels.join(','),
       isPrivate,
     }
     if (draftId && draftId !== 'new') {
       try {
         await put('/draft', { ...data, id: draftId })
       } catch (e) {
         fail(e)
       }
     } else {
       try {
         const result = await post('/draft', data)
         store.draftId = result.id
       } catch (e) {
         fail(e)
       }
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
