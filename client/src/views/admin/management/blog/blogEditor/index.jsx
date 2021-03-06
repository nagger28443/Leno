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
    this.state = {
      newPostDisabled: false,
      draftDisabled: false,
    }
  }

  @action
  handleTitleChange = value => {
    store.title = value
  }

  @action
  handleContentChange = value => {
    store.md = value
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
      const data = await get(`${isDraft ? '/draft' : '/blog'}`, { id, editing: true })
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
      md: '',
      labels: [],
      category: '',
      isPrivate: false,
    })
  }

  validate = () => {
    const { title, md } = store

    if (
      !this.titleInput.validate(title)
      || !this.contentInput.validate(md)
    ) {
      return false
    }
    if (store.category.length === 0) {
      message.error('Category required')
      return false
    }
    return true
  }

  postBlog = async () => {
    if (!this.validate()) return

    this.setState({
      newPostDisabled: true,
    })

    const {
      labels, category, isPrivate, blogId, draftId, title, md,
    } = store
    try {
      if (blogId) {
        await put('/blog', {
          id: blogId, title, md, labels: labels.join(','), category, isPrivate,
        })
      } else {
        await post('/blog', {
          title, md, labels: labels.join(','), category, isPrivate,
        })
      }

      if (draftId) {
        await dele('/draft', { id: draftId })
      }

      message.info('Published successfully')
      this.props.history.push('/admin/blog/list')
    } catch (e) {
      this.setState({
        newPostDisabled: false,
      })
      fail(e)
    }
  }

   saveDraft = async () => {
     if (!this.validate()) return

     this.setState({
       draftDisabled: true,
     })

     const {
       draftId, title, md, category, labels, isPrivate,
     } = store
     const data = {
       title,
       md,
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
     this.setState({
       draftDisabled: false,
     })
   }

   render() {
     const { classes } = this.props
     const { title, md } = store
     const { newPostDisabled, draftDisabled } = this.state
     return (
       <div className={classes.root}>
         <div className={classes.row}>
           <Input
             bridge={this.titleInput}
             rules={[
               { max: 50, message: 'Title can not be more than 50 characters' },
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
               { max: 20000, message: 'Content can not be more than 20000 characters' },
             ]}
             className={classes.content}
             value={md}
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
             <Button
               style={{
                 marginRight: '0.5rem',
                 marginLeft: '5.5rem',
                 cursor: newPostDisabled ? 'not-allowed' : 'pointer',
               }}
               text="POST"
               onClick={this.postBlog}
             />
             <Button
               text="SAVE DRAFT"
               onClick={this.saveDraft}
               style={{ cursor: draftDisabled ? 'not-allowed' : 'pointer' }}
             />
           </div>
         </div>
       </div>
     )
   }
}

export default injectSheet(styles)(BlogEditor)
