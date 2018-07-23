import { observable } from 'mobx'

class BlogEditorStore {
  @observable id = null

  @observable title = ''

  @observable content = ''

  @observable labels = ['hha', 'huhu']

  @observable category = ''

  @observable isPrivate = false
}
export default new BlogEditorStore()
