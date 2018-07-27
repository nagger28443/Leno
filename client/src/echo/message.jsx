import React from 'react'
import ReactDom from 'react-dom'
import injectSheet from 'react-jss'
import './message.styl'

const styles = {
  root: {
    padding: '1rem',
    position: 'relative',
  },
  close: {
    position: 'absolute',
    right: '0.5rem',
    top: '0.2rem',
    cursor: 'pointer',

  },
}

const gap = 1
const height = 5
const minTopSpace = 100
const { body } = document
const messages = {}

@injectSheet(styles)
class Message extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  componentDidMount() {
    const { autoClose } = this.props
    if (autoClose) {
      setTimeout(this.handleClose, 3000)
    }
  }

  // message位置不合理,前面的消息关闭后后面的消息还会向上移动,优化 todo
  handleClose = () => {
    const { ele, position } = this.props
    body.removeChild(ele)
    messages[position] = false
  }

  render() {
    const { msg, classes } = this.props
    return (
      <div className={classes.root}>
        <span>{msg}</span>
        <div className={classes.close} onClick={this.handleClose}>x</div>
      </div>
    )
  }
}

const getPosition = () => {
  let s = gap
  while (s + height + minTopSpace < window.innerHeight) {
    if (!messages[s]) {
      messages[s] = true
      return s
    }
    s += height + gap
  }
  return gap
}

const baseMessage = (msg, opt, type) => {
  const ele = document.createElement('div')

  const bottom = getPosition()
  ele.className = `leno-message-${type}`
  ele.style.height = `${height}rem`
  ele.style.bottom = `${bottom}rem`

  body.appendChild(ele)
  ReactDom.render(<Message msg={msg} autoClose={opt.autoClose} ele={ele} position={bottom} />, ele)

  setTimeout(() => {
    ele.style.right = `${gap}rem`
  }, 0)
}

const message = {}

message.info = (msg, opt = { autoClose: true }) => {
  baseMessage(msg, opt, 'info')
}

message.warning = (msg, opt = { autoClose: true }) => {
  baseMessage(msg, opt, 'warning')
}

message.error = (msg, opt = { autoClose: true }) => {
  baseMessage(msg, opt, 'error')
}

export default message
