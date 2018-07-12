import { observable } from 'mobx'

class AppStore {
  @observable blogContent = ''
  history = null
}
export default new AppStore()
