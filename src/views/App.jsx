import React from 'react'
import _ from 'lodash'
import SideBar from './sideBar'
import Contnets from './contents'
import { SIDE_TO_TOP_WIDTH } from '../../src/constants'

const TOPBAR = 'topbar'
const SIDEBAR = 'sidebar'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    const barType = this.getBarType()
    this.state = {
      barType,
      contentStyle: this.getContentStyle(barType),
      barStyle:
        barType === TOPBAR ? { height: window.innerWidth * 0.17 } : { position: 'fixed', top: 0 },
    }
  }

  componentDidMount() {
    window.addEventListener('resize', _.throttle(this.handleResize, 50), false)
    window.addEventListener('scroll', _.throttle(this.getHandleScroll(), 30), false)
  }

  getBarType = () =>
    window.matchMedia(`(min-width: ${SIDE_TO_TOP_WIDTH}px)`).matches ? SIDEBAR : TOPBAR

  getBarStyle = (barType, scrollDir) => {
    if (barType === TOPBAR) {
      return { height: window.innerWidth * 0.17 }
    }
    const offset =
      window.innerHeight + window.pageYOffset - document.querySelector('.banner').clientHeight
    const { barStyle } = this.state
    if (scrollDir === 'down' && offset >= 0) {
      return { ...barStyle, position: 'fixed', top: null, bottom: 0 }
    } else if (scrollDir === 'up' && offset >= 0 && !this.state.barStyle.top) {
      return { barStyle, position: 'absolute', top: offset, bottom: null }
    }
    return barStyle
  }

  getContentStyle = barType => ({ marginLeft: barType === TOPBAR ? 0 : '27%' })

  getHandleScroll = () => {
    let prevY = window.pageYOffset
    return () => {
      this.setState({
        barStyle: this.getBarStyle(
          this.getBarType(),
          window.pageYOffset - prevY < 0 ? 'up' : 'down',
        ),
      })
      prevY = window.pageYOffset
    }
  }

  handleResize = () => {
    const barType = this.getBarType()
    this.setState({
      barType,
      contentStyle: this.getContentStyle(barType),
      barStyle: this.getBarStyle(barType),
    })
  }
  render() {
    return (
      <React.Fragment>
        <SideBar classNames={`banner ${this.state.barType}`} style={this.state.barStyle} />
        <Contnets style={this.state.contentStyle} />
      </React.Fragment>
    )
  }
}
