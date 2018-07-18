import { observable } from 'mobx'

class BlogEditorStore {
  @observable labels = ['hha', 'huhu']
  @observable category = ''
}
export default new BlogEditorStore()
