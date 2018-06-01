import React from 'react'
import Blog from './blog'

export default class Contents extends React.Component {
  handl = () => {}
  render() {
    return (
      <div className="contents">
        <Blog />
        <Blog />
        <Blog />
        <Blog />
        <Blog />
      </div>
    )
  }
}
