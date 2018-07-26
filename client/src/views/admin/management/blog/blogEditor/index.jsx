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
    ) {
      return
    }
    if (store.category.length === 0) {
      message.error('Category required')
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

      message.info('Published successfully')
      this.props.history.push('/admin/blog/list')
    } catch (e) {
      fail(e)
    }
  }

  @action
  async componentDidMount() {
    const { id } = this.props.match.params

    if (id === 'new') return

    const { pathname } = this.props.location
    const isDraft = pathname.startsWith('/admin/draft')
    if (isDraft) {
      store.draftId = id
    } else {
      store.blogId = id
    }

    try {
      const data = await get(`${isDraft ? '/draft' : '/blog'}`, { id })
      runInAction(() => {
        Object.assign(store, data, { labels: data.labels.length > 0 ? data.labels.split(',') : [] })
      })
    } catch (e) {
      fail(e)
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
               { max: 50, message: 'Title can not be longer then 50 characters' },
               { required: true, message: 'Title required' },
             ]}
             boxStyle={{ width: '100%' }}
             onChange={this.handleTitleChange}
             value={title}
             placeholder="Post title"
           />
         </div>
         <div className={classes.row}>
           <TextArea
             bridge={this.contentInput}
             rules={[
               { required: true, message: 'Content required' },
               { max: 20000, message: 'Content can not be longer then 20000 characters' },
             ]}
             className={classes.content}
             value={content}
             onChange={this.handleContentChange}
             placeholder="Post content"
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
             <Button style={{ marginRight: '0.5rem', marginLeft: '5.5rem' }} text="POST" onClick={this.postBlog} />
             <Button text="SAVE DRAFT" onClick={this.saveDraft} />
           </div>
         </div>
       </div>
     )
   }
}

export default injectSheet(styles)(BlogEditor)
