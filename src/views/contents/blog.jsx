import React from 'react'
import injectSheet from 'react-jss'
import { inject, observer } from 'mobx-react'
import { observable, action } from 'mobx'
import article from '../../blogs/1.md'
import MDParser from '../../util/MDParser'

const styles = {
  article: {
    background: '#ffffff',
    wordBreak: 'break-word',
    padding: ['2rem', '5%', '8rem', '5%'],
    position: 'relative',
    transition: 'height 0.3s',
    overflow: 'hidden',
    '&:after': {
      width: '100%',
      height: '4rem',
      background: 'linear-gradient(to right, #f5f5f5, #ffffff)',
      content: '""',
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
  },
  toggleCollapse: {
    position: 'absolute',
    width: '100%',
    height: '5rem',
    bottom: '4rem',
    left: 0,
    paddingTop: '3rem',
    textAlign: 'center',
    letterSpacing: '0.3rem',
    fontSize: 'smaller',
    color: '#4663bbdb',
    background: 'linear-gradient(to top,#f5f5f5,#ffffff 50%,#ffffff66)',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}
inject('appStore')
@observer
class Blog extends React.Component {
  @observable isArticleCollapsed = true

  @action
  toggleArticleCollapse = e => {
    this.isArticleCollapsed = !this.isArticleCollapsed
    if (this.isArticleCollapsed) {
      window.scrollTo({
        top: e.target.parentElement.offsetTop,
        behavior: 'smooth',
      })
    }
  }

  render() {
    const { classes } = this.props
    return (
      <article
        className={classes.article}
        style={{ height: this.isArticleCollapsed ? '40rem' : '100%' }}>
        {MDParser(article)}
        <div className={classes.toggleCollapse} onClick={this.toggleArticleCollapse}>
          {this.isArticleCollapsed ? '<<<点击展开>>>' : '>>>点击收起<<<'}
        </div>
      </article>
    )
  }
}

export default injectSheet(styles)(Blog)
