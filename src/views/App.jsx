import React from 'react'
import _ from 'lodash'
import SideBar from './sideBar'
import Contnets from './contents'
import { SIDE_TO_TOP_WIDTH } from '../../src/constants'

const TOPBAR = 'topbar'
const FIXEDBAR = 'fixedbar'
const FLOATBAR = 'floatbar'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    const barType = this.getBarType()
    this.state = {
      contentStyle: this.getContentStyle(barType),
      barStyle: this.getBarStyle(barType),
      barType,
    }
  }

  componentDidMount() {
    window.addEventListener(
      'resize',
      _.throttle(() => {
        const barType = this.getBarType()
        this.setState({
          contentStyle: this.getContentStyle(barType),
          barStyle: this.getBarStyle(barType),
          barType,
        })
      }, 200),
      false,
    )
    window.addEventListener(
      'scroll',
      _.throttle(() => {
        const barType = this.getBarType()
        this.setState({
          barStyle: this.getBarStyle(barType),
          barType,
        })
      }, 0),
      false,
    )
  }
  getBarType = () => {
    let barType
    if (!window.matchMedia(`(min-width: ${SIDE_TO_TOP_WIDTH}px)`).matches) {
      barType = TOPBAR
    } else if (
      document.querySelector('.sidebar') &&
      window.innerHeight + document.documentElement.scrollTop >=
        document.querySelector('.sidebar').clientHeight
    ) {
      barType = FIXEDBAR
    } else {
      barType = FLOATBAR
    }
    return barType
  }
  getBarStyle = barType =>
    barType === TOPBAR
      ? { height: window.innerWidth * 0.17, width: '100vw' }
      : { minHeight: '100vh', width: '27%' }
  getContentStyle = barType => ({ marginLeft: barType === TOPBAR ? 0 : '27%' })
  render() {
    return (
      <React.Fragment>
        <SideBar classNames={`sidebar ${this.state.barType}`} style={this.state.barStyle} />
        <Contnets style={this.state.contentStyle} />
      </React.Fragment>
    )
  }
}
