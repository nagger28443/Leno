import { observable, action } from 'mobx'

class LabelStore {
  @observable isLabelModalVisible = true
  @observable style = this.getModalStyle(false)

  @action
  showLabelModal = () => {
    this.style = this.getModalStyle(true)
  }
  @action
  hideLabelModal = () => {
    this.style = this.getModalStyle(false)
  }

  @action getModalStyle = tobe => ({ transform: tobe ? 'scale(1)' : 'scale(0)' })
}

export default new LabelStore()
