import React from 'react'
import _ from 'lodash'
import SideBar from './sideBar'
import Contnets from './contents'
import { SIDE_TO_TOP_WIDTH } from '../../src/constants'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.hasTopBar = window.matchMedia(
      `(min-width: ${SIDE_TO_TOP_WIDTH}px)`,
    ).matches

    this.state = {
      barClass: this.hasTopBar ? ['sidebar'] : ['sidebar', 'on-top'],
      barStyle: this.getStyle(),
      contentStyle: { marginLeft: this.hasTopBar ? 0 : '27%' },
    }
  }

  componentDidMount() {
    window.addEventListener(
      'resize',
      _.throttle(() => {
        this.setState({
          barStyle: this.getStyle(),
          barClass: this.hasTopBar ? ['sidebar', 'on-top'] : ['sidebar'],
        })
      }, 200),
      false,
    )
  }
  getStyle = () => {
    const { innerWidth } = window
    this.hasTopBar = !window.matchMedia(`(min-width: ${SIDE_TO_TOP_WIDTH}px)`)
      .matches
    const style = !this.hasTopBar
      ? { height: '100vh', width: '27%' }
      : { height: innerWidth * 0.17, width: '100vw' }
    return style
  }
  render() {
    return (
      <React.Fragment>
        <SideBar
          classNames={this.state.barClass.join(' ')}
          style={this.state.barStyle}
        />
        <Contnets style={this.state.contentStyle} />
      </React.Fragment>
    )
  }
}
