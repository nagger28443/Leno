import { configure } from 'mobx'

// don't allow state modifications outside actions
configure({ enforceActions: true })

class AppStore {
  a = 1
}

export default new AppStore()
