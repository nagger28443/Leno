import React from 'react'
import ReactDom from 'react-dom'
import injectSheet from 'react-jss'
import './message.styl'

const styles = {
  root: {
  },
}
const root = document.getElementById('root')

@injectSheet(styles)
class Message extends React.Component {
  constructor() {
    super()
    this.ref = React.createRef()
    this.state = {
      visible: true,
    }
  }

  componentDidMount() {
    const { autoClose } = this.props
    if (autoClose) {
      setTimeout(() => {
        root.removeChild(this.ref)
      }, 5000)
    }
    // this.setState({ style: { transform: 'translateY(-100%)' } })
  }

  handleClose = () => {
    this.setState({ visible: false })
  }

  render() {
    const { msg, classes } = this.props
    const { visible } = this.state
    return <p className={classes.root} ref={this.ref} style={{ display: visible ? 'block' : 'none' }}>{msg}</p>
  }
}

const message = {}

message.info = (msg, opt = { autoClose: true }) => {
  const ele = document.createElement('div')
  ele.className = 'leno-message'
  root.appendChild(ele)
  ReactDom.render(<Message msg={msg} autoClose={opt.autoClose} />, ele)
  setTimeout(() => {
    ele.classList.add('leno-message-transform')
  }, 0)
}

export default message
