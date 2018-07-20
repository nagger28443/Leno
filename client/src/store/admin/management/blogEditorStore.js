import { observable } from 'mobx'

class BlogEditorStore {
  @observable labels = ['hha', 'huhu']

  @observable category = ''

  @observable isPrivate = false
}
export default new BlogEditorStore()
