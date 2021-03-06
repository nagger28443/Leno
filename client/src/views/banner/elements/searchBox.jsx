import React from 'react'
import injectSheet from 'react-jss'
import { withRouter } from 'react-router-dom'

const styles = {
  searchBox: {
    position: 'fixed',
    bottom: '1rem',
  },
  searchInput: {
    marginLeft: '0.5rem',
    padding: 0,
    transition: 'width 0.3s',
    border: 'none',
    lineHeight: 2,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    background: 'linear-gradient(to right,#e6e1e1e0,#f5f5f5)',
    '&:focus': {
      outline: 0,
      background: 'linear-gradient(to right,#d4d2d2,#f5f5f5)',
    },
  },
  warning: {
    color: 'red',
    fontSize: 'small',
    marginLeft: '1.6rem',
  },
}

class SearchBox extends React.Component {
  state = {
    isInputCollapsed: true,
    warning: '',
  }

  handleInputBlur = () => {
    setTimeout(() => {
      this.setState({ isInputCollapsed: true })
    }, 100)
  }

  toggleInputCollapse = () => {
    const { isInputCollapsed } = !this.state
    this.setState({ isInputCollapsed })
    if (!isInputCollapsed) {
      this.input.focus()
    }
  }

  handleSearch = e => {
    const text = e.target.value.trim()
    e.target.value = ''
    if (text.length === 0) {
      this.setState({
        warning: 'Content required!',
      })
      setTimeout(() => {
        this.setState({
          warning: '',
        })
      }, 2000)
      return
    }
    this.props.history.push(`/list?search=${text}`)
    this.setState({ isInputCollapsed: true })
  }

  handleKeyEnter = e => {
    if (e.key === 'Enter') {
      this.handleSearch(e)
    }
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.searchBox}>
        <div
          className={classes.warning}
          style={{ display: this.state.warning.length ? 'block' : 'none' }}
        >
          {this.state.warning}
        </div>
        <span className="icon-search plain-link" onClick={this.toggleInputCollapse} />
        <input
          type="text"
          ref={input => {
            this.input = input
          }}
          onBlur={this.handleInputBlur}
          placeholder="Search"
          onKeyPress={this.handleKeyEnter}
          className={classes.searchInput}
          style={{ width: this.state.isInputCollapsed ? 0 : '80%' }}
        />
      </div>
    )
  }
}

export default injectSheet(styles)(withRouter(SearchBox))
