import { observable } from 'mobx'

class AppStore {
  @observable blogContent = ''
}
export default new AppStore()
