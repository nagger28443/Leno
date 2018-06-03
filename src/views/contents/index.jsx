import React from 'react'
import Blog from './blog'

export default class Contents extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.style.marginLeft !== nextProps.style.marginLeft
  }

  render() {
    return (
      <div className="contents" style={this.props.style}>
        <Blog />
        <Blog />
        <Blog />
        <Blog />
        <Blog />
      </div>
    )
  }
}
