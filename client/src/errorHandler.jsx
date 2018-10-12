import React from 'react'


class ErrorHandler extends React.Component {
  state={
    crashed: false,
  }

  componentDidCatch(err) {
    this.setState({
      crashed: true,
    })
    console.log(err)
  }

  render() {
    const { crashed } = this.state
    if (crashed) {
      return '出错了'
    }
    return this.props.children
  }
}

export default ErrorHandler
