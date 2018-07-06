import React from 'react'
import injectSheet from 'react-jss'
import { inject, observer } from 'mobx-react'
import { observable, action } from 'mobx'
import article from '../../blogs/1.md'
import MDParser from '../../util/MDParser'
import { get } from '../../util/http'
import { fail } from '../../util/utils'
import BlogHeader from '../commonComponents/blogHeader'

const styles = {
  root: {
    background: '#ffffff',
    padding: '4rem',
  },
  article: {
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
    height: '8rem',
    bottom: '4rem',
    left: 0,
    paddingTop: '6rem',
    textAlign: 'center',
    letterSpacing: '0.3rem',
    fontSize: 'smaller',
    color: '#4663bbdb',
    background: 'linear-gradient(to top,#f5f5f5,#ffffff 50%,#ffffff66)',
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

  componentDidMount() {
    get('/get', {
      nick: 'Leno',
      love: 'coding',
    })
      .then(resp => {
        console.log(resp)
      })
      .catch(err => {
        fail(err)
      })
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <article
          className={classes.article}
          style={{ height: this.isArticleCollapsed ? '50rem' : '' }}>
          <BlogHeader
            data={{
              title: '(小结)React中实现离开页面确认提示',
              date: '2018-07-05',
              category: 'coding',
              labels: ['React', 'React-Router'],
            }}
          />
          {MDParser(article)}
          <div className={classes.toggleCollapse} onClick={this.toggleArticleCollapse}>
            <span className="plain-link">
              {this.isArticleCollapsed ? '<<<点击展开>>>' : '>>>点击收起<<<'}
            </span>
          </div>
        </article>
      </div>
    )
  }
}

export default injectSheet(styles)(Blog)
