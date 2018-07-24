import { observable } from 'mobx'

class BlogEditorStore {
  @observable blogId = null

  @observable draftId = null

  @observable title = ''

  @observable content = ''

  @observable labels = []

  @observable category = ''

  @observable isPrivate = false
}
export default new BlogEditorStore()
