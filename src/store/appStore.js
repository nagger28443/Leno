import { observable, action } from 'mobx'
import _ from 'lodash'
import { SIDE_TO_TOP_WIDTH, TOPBAR, SIDEBAR } from '../../src/constants'

class AppStore {
  constructor() {
    window.addEventListener('resize', _.throttle(this.handleResize, 100), false)
    window.addEventListener('scroll', _.throttle(this.handleScroll(), 200), false)
  }
  @observable barType = this.getBarType()
  @observable barStyle = this.getBarStyle(this.barType)

  isBarExpanded = true

  @action
  handleResize = () => {
    const barType = this.getBarType()
    this.barType = barType
    this.isBarExpanded = true
    Object.assign(this.barStyle, this.getBarStyle(barType))
  }

  handleScroll = () => {
    let prevY = window.pageYOffset
    return action(() => {
      const curY = window.pageYOffset
      const { barType } = this
      if (barType === TOPBAR) {
        if (curY > prevY && this.isBarExpanded) {
          // down, collapsed
          Object.assign(this.barStyle, { height: 0 })
          this.isBarExpanded = false
        } else if (curY < prevY && !this.isBarExpanded) {
          Object.assign(this.barStyle, { height: window.innerWidth * 0.17 })
          this.isBarExpanded = true
        }
      } else {
        Object.assign(this.barStyle, this.getBarStyle(barType))
      }
      prevY = curY
    })
  }

  getBarType = () =>
    window.matchMedia(`(min-width: ${SIDE_TO_TOP_WIDTH}px)`).matches ? SIDEBAR : TOPBAR

  getBarStyle = barType => ({
    height: barType === TOPBAR ? window.innerWidth * 0.17 : '100vh',
    marginTop: barType === TOPBAR ? 0 : window.pageYOffset,
  })
}
export default new AppStore()
