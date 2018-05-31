import React from 'react'
import _ from 'lodash'

export default class SideBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      style: this.getStyle(),
    }
  }

  componentDidMount() {
    window.addEventListener(
      'resize',
      _.throttle(() => {
        this.setState({
          style: this.getStyle(),
        })
      }, 200),
      false,
    )
  }
  getStyle = () => {
    const { innerWidth } = window
    const style = window.matchMedia('(min-width: 960px)').matches
      ? { height: '100%', width: '27%' }
      : { height: innerWidth * 0.17, width: '100%' }
    return style
  }
  render() {
    return (
      <div className="sidebar" style={this.state.style}>
        sidebar
      </div>
    )
  }
}
