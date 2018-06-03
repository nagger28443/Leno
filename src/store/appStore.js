import { observable, action } from 'mobx'
import _ from 'lodash'
import { SIDE_TO_TOP_WIDTH } from '../../src/constants'

const TOPBAR = 'topbar'
const SIDEBAR = 'sidebar'

class AppStore {
  constructor() {
    window.addEventListener('resize', _.throttle(this.handleResize, 100), false)
  }
  @observable barType = this.getBarType()
  @observable contentStyle = this.getContentStyle(this.barType)
  @observable barStyle = this.getBarStyle(this.barType)

  @action
  handleResize = () => {
    const barType = this.getBarType()
    this.barType = barType
    Object.assign(this.contentStyle, this.getContentStyle(barType))
    Object.assign(this.barStyle, this.getBarStyle(barType))
  }

  getBarType = () =>
    window.matchMedia(`(min-width: ${SIDE_TO_TOP_WIDTH}px)`).matches ? SIDEBAR : TOPBAR

  getBarStyle = barType => ({
    height: barType === TOPBAR ? window.innerWidth * 0.17 : '100vh',
  })

  getContentStyle = barType => ({ marginLeft: barType === TOPBAR ? '0' : '27%' })
}
export default new AppStore()
