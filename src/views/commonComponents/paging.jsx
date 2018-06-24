import React from 'react'
import injectSheet from 'react-jss'

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
  constructor(props) {
    super(props)
    this.pageCount = 0
    this.state = {
      curPage: 1,
    }
  }
  goToPage = page => {
    this.props.handlePageChange(page)
    this.setState({
      curPage: page,
    })
  }
  checkPageInvalid = page => {
    const { curPage } = this.state
    return (
      (page === '<' && curPage === 1) ||
      (page === '>' && curPage === this.pageCount) ||
      Number(page) === curPage
    )
  }
  handlePageChange = e => {
    const target = e.target.innerText
    const { curPage } = this.state

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
    const { curPage } = this.state
    const { total = 0, countPerPage = 10, classes } = this.props
    this.pageCount = Math.ceil(total / countPerPage)
    return (
      <div className={classes.root}>
        <span
          className={`${'plain-link'} ${classes.pageNO}`}
          style={{ cursor: curPage === 1 ? 'not-allowed' : 'pointer' }}
          onClick={this.handlePageChange}>
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
          onClick={this.handlePageChange}>
          {'>'}
        </span>
      </div>
    )
  }
}

export default injectSheet(styles)(Paging)
