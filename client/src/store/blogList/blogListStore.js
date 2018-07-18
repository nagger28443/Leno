import { observable } from 'mobx'

class BlogListStore {
  getData = null
  total = 0
  @observable query = {}
  @observable data = []
}

export default new BlogListStore()
