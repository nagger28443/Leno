import React from 'react'
import PropTypes from 'prop-types'

export default class sidebar extends React.Component {
  static propTypes = {
    classNames: PropTypes.string,
    style: PropTypes.object,
  }
  handle = () => {}
  render() {
    return (
      <aside className={this.props.classNames} style={this.props.style}>
        sidebar
      </aside>
    )
  }
}
