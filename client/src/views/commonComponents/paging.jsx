import React from 'react'
import injectSheet from 'react-jss'
import { withRouter } from 'react-router-dom'

const styles = {
  root: {
    margin: ['2rem', 0, 0, '2rem'],
  },
  pageNO: {
    width: '1.2rem',
    textAlign: 'center',
  },
  activePage: {
    color: '#ffffff',
    background: '#a19f9f',
  },
}

class Paging extends React.Component {
  pageCount = 0

  state = { curPage: 1 }

  getCurpage = () => this.props.curPage || this.state.curPage

  goToPage = page => {
    this.props.handlePageChange(page)
    if (this.props.curPage !== undefined) {
      this.setState({
        curPage: page,
      })
    }
  }

  checkPageInvalid = page => {
    const curPage = this.getCurpage()
    return (
      (page === '<' && curPage === 1)
      || (page === '>' && curPage === this.pageCount)
      || Number(page) === curPage
    )
  }

  handlePageChange = e => {
    const target = e.target.innerText
    const curPage = this.getCurpage()

    if (this.checkPageInvalid(target)) return
    if (target === '<') {
      this.goToPage(curPage - 1)
    } else if (target === '>') {
      this.goToPage(curPage + 1)
    } else {
      this.goToPage(Number(target))
    }
  }

  render() {
    const curPage = this.getCurpage()
    const { total = 0, countPerPage = 10, classes } = this.props
    this.pageCount = Math.ceil(total / countPerPage)
    return (
      <div className={classes.root}>
        <span
          className={`${'plain-link'} ${classes.pageNO}`}
          style={{ cursor: curPage === 1 ? 'not-allowed' : 'pointer' }}
          onClick={this.handlePageChange}
        >
          {'<'}
        </span>
        {/* eslint-disable */}
        {Array.from({ length: this.pageCount }).map((item, i) => (
          <span
            className={`${'plain-link'} ${classes.pageNO} ${i + 1 === curPage ? classes.activePage : ''}`}
            key={i + 1}
            onClick={this.handlePageChange}>
            {i + 1}
          </span>
        ))}
        {/* eslint-enable */}
        <span
          className={`${'plain-link'} ${classes.pageNO}`}
          style={{ cursor: curPage === this.pageCount ? 'not-allowed' : 'pointer' }}
          onClick={this.handlePageChange}
        >
          {'>'}
        </span>
      </div>
    )
  }
}

export default withRouter(injectSheet(styles)(Paging))
