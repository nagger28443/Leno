import React from 'react'
import injectSheet from 'react-jss'
import { Detail } from '../../styledComponents'
import BlogListItem from './blogListItem'
import Paging from './paging'

const styles = {
  root: {
    position: 'relative',
    paddingLeft: '2rem',
    '&:before': {
      content: '""',
      height: '100%',
      width: '0.2rem',
      position: 'absolute',
      left: 0,
      top: '0.4rem',
      background: '#e5e3e3',
    },
  },
  mark: {
    position: 'relative',
    '&:hover:before': {
      background: '#af75d8fc',
    },
    '&:before': {
      content: '""',
      height: '0.6rem',
      width: '0.6rem',
      borderRadius: '50%',
      position: 'absolute',
      left: '-2.2rem',
      top: '0.4rem',
      background: '#b6b4b4',
    },
  },
  year: {
    fontSize: 'x-large',
    margin: ['2rem', 0],
  },
  month: {
    fontSize: 'larger',
    margin: ['1rem', 0],
  },
}

class Archive extends React.Component {
  state = {
    archives: [],
    curPage: 1,
  }

  data = []

  handlePageChange = page => {
    document.documentElement.scrollIntoView()
    const { history } = this.props
    history.push({ state: { page } })
    this.setState({
      curPage: page,
      archives: this.dataFormat(this.data.slice(10 * page - 10, 10 * page)),
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { page } = nextProps.history.location.state || { page: 1 }
    if (page !== prevState.curPage) {
      return {
        curPage: page,
      }
    }
    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.curPage !== this.state.curPage) {
      const { curPage } = this.state
      this.setState({ // eslint-disable-line
        archives: this.data.slice(10 * curPage - 10, 10 * curPage),
      })
    }
  }

  render() {
    const { classes } = this.props
    const { curPage, archives } = this.state
    return (
      <Detail>
        <div className={classes.root}>
          {archives.map(item => (
            <div className={classes.mark} key={item.data.id}>
              <p className={classes.year}>{item.year}年</p>
              {item.data.map(ele => (
                <div className={classes.mark} key={ele.data.id}>
                  <p className={classes.month}>{ele.month}月</p>
                  {ele.data.map(d => <BlogListItem data={d.data} key={d.data.id} />)}
                </div>
              ))}
            </div>
          ))}
        </div>
        <Paging
          total={this.data.length}
          curPage={curPage}
          handlePageChange={this.handlePageChange}
        />
      </Detail>
    )
  }
}
export default injectSheet(styles)(Archive)
