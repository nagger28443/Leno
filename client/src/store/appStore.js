import { observable, action } from 'mobx'
import _ from 'lodash'
import { SIDE_TO_TOP_WIDTH, TOPBAR, SIDEBAR, SHOW_RIGHTBAR_WIDTH } from '../../src/constants'

class AppStore {
  constructor() {
    window.addEventListener('resize', _.throttle(this.handleResize, 100), false)
    window.addEventListener('scroll', _.debounce(this.handleScroll(), 50), false)
  }

  @observable blogContent = []
  // @observable anchors = []
  anchors = []
  history = null

  @observable bannerType = this.getBannerType()
  @observable bannerStyle = this.getBannerStyle(this.bannerType)
  @observable rightBarStyle = this.getRightBarStyle()

  isRightBarVisible = window.matchMedia(`(min-width: ${SHOW_RIGHTBAR_WIDTH}px)`).matches
  isBannerExpanded = true

  @action
  handleResize = () => {
    const bannerType = this.getBannerType()
    this.bannerType = bannerType
    this.isBannerExpanded = true
    Object.assign(this.bannerStyle, this.getBannerStyle(bannerType))

    this.isRightBarVisible = window.matchMedia(`(min-width: ${SHOW_RIGHTBAR_WIDTH}px)`).matches
    Object.assign(this.rightBarStyle, this.getRightBarStyle())
  }

  handleScroll = () => {
    let prevY = window.pageYOffset
    return action(() => {
      const curY = window.pageYOffset
      const { bannerType } = this
      if (bannerType === TOPBAR) {
        if (curY > prevY + 100 && this.isBannerExpanded) {
          // down, collapsed
          Object.assign(this.bannerStyle, { height: 0 })
          this.isBannerExpanded = false
        } else if (curY < prevY - 100 && !this.isBannerExpanded) {
          Object.assign(this.bannerStyle, { height: window.innerWidth * 0.17 })
          this.isBannerExpanded = true
        }
      } else {
        Object.assign(this.bannerStyle, this.getBannerStyle(bannerType))
      }
      Object.assign(this.rightBarStyle, this.getRightBarStyle())
      prevY = curY
    })
  }

  getBannerType = () =>
    window.matchMedia(`(max-width: ${SIDE_TO_TOP_WIDTH}px)`).matches ? TOPBAR : SIDEBAR

  getBannerStyle = bannerType => ({
    height: bannerType === TOPBAR ? window.innerWidth * 0.17 : '100vh',
    marginTop: bannerType === TOPBAR ? 0 : window.pageYOffset,
  })

  getRightBarStyle = () => ({
    marginTop: window.pageYOffset,
    display: this.isRightBarVisible ? 'block' : ' none',
  })
}
export default new AppStore()
