import { observable } from 'mobx'

class BlogEditorStore {
  @observable blogId = null

  @observable draftId = null

  @observable title = ''

  @observable md = ''

  @observable labels = []

  @observable category = ''

  @observable isPrivate = false
}
export default new BlogEditorStore()
