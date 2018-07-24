import React from 'react'


class ErrorHandler extends React.Component {
  state={
    crashed: false,
  }

  componentDidCatch(err) {
    console.log(123, err)
  }

  render() {
    const { crashed } = this.state
    if (crashed) {
      return 123
    }
    return this.props.children
  }
}

export default ErrorHandler
