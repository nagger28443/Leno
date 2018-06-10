import { observable, action } from 'mobx'

class SearchBoxStore {
  @observable isSearchVisible = false

  @action toggleSearch = () => {}
}

export default new SearchBoxStore()
