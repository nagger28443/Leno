import { observable, action } from 'mobx'
import _ from 'lodash'
import { SIDE_TO_TOP_WIDTH } from '../../src/constants'

const TOPBAR = 'topbar'
const SIDEBAR = 'sidebar'

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
    if (this.barType === TOPBAR) {
      Promise.resolve(
        action(() => {
          console.log(123)
          Object(this.barStyle, { transition: 'height 0.4s' })
        }),
      )
    } else {
      Object(this.barStyle, { transition: '' })
    }
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

      // if (barType === TOPBAR && curY > prevY && !this.isBarExpanded) { // 向下, 且展开状态
      //   Object.assign(this.barStyle, this.getBarStyle(barType, window.innerWidth * 0.17))
      // } else {
      //   Object.assign(this.barStyle, this.getBarStyle(barType))
      // }
      prevY = curY
    })
  }

  getBarType = () =>
    window.matchMedia(`(min-width: ${SIDE_TO_TOP_WIDTH}px)`).matches ? SIDEBAR : TOPBAR

  getBarStyle = barType => ({
    height: barType === TOPBAR ? window.innerWidth * 0.17 : '700vh',
    marginTop: barType === TOPBAR ? 0 : window.pageYOffset - window.innerHeight * 3,
    // transform: `translateY(${translate}%)`,
  })
}
export default new AppStore()
