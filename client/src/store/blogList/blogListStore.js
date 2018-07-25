import { observable } from 'mobx'

class BlogListStore {
  total = 0

  @observable query = {}

  @observable data = []
}

export default new BlogListStore()
