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
let prevBottom = gap

@injectSheet(styles)
class Message extends React.Component {
  constructor() {
    super()
    this.ref = React.createRef()
    this.state = {
    }
  }

  componentDidMount() {
    const { autoClose } = this.props
    this.parent = this.ref.current.parentElement
    if (this.parent.offsetTop < minTopSpace) {
      prevBottom = gap
    }
    if (autoClose) {
      setTimeout(this.handleClose, 30000)
    }
  }

  handleClose = () => {
    body.removeChild(this.parent)
  }

  render() {
    const { msg, classes } = this.props
    return (
      <div className={classes.root} ref={this.ref}>
        <span>{msg}</span>
        <div className={classes.close} onClick={this.handleClose}>x</div>
      </div>
    )
  }
}


const baseMessage = (msg, opt, type) => {
  const ele = document.createElement('div')

  ele.className = `leno-message-${type}`
  ele.style.height = `${height}rem`
  ele.style.bottom = `${prevBottom}rem`
  prevBottom += height + gap

  body.appendChild(ele)
  ReactDom.render(<Message msg={msg} autoClose={opt.autoClose} />, ele)

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
