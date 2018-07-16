import { observable, action } from 'mobx'

class LabelStore {
  @observable isLabelModalVisible = false

  @action
  showLabelModal = () => {
    this.isLabelModalVisible = true
  }
  @action
  hideLabelModal = () => {
    this.isLabelModalVisible = false
  }
}

export default new LabelStore()
