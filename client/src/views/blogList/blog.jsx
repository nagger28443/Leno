import React from 'react'
import injectSheet from 'react-jss'
import BlogHeader from '../commonComponents/blogHeader'

const styles = {
  root: {
    background: '#ffffff',
  },
  article: {
    padding: '4rem',
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

class Blog extends React.Component {
  state = {
    isArticleCollapsed: true,
  }

  toggleArticleCollapse = e => {
    const { isArticleCollapsed } = this.state
    this.setState({
      isArticleCollapsed: !isArticleCollapsed,
    })
    if (!isArticleCollapsed) {
      window.scrollTo({
        top: e.target.parentElement.offsetTop,
        behavior: 'smooth',
      })
    }
  }

  render() {
    const { classes, data } = this.props
    const { isArticleCollapsed } = this.state
    return (
      <div className={classes.root}>
        <article className={classes.article} style={{ height: isArticleCollapsed ? '50rem' : '' }}>
          <BlogHeader data={data} />
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
          <div className={classes.toggleCollapse} onClick={this.toggleArticleCollapse}>
            <span className="plain-link">
              {isArticleCollapsed ? '<<<点击展开>>>' : '>>>点击收起<<<'}
            </span>
          </div>
        </article>
      </div>
    )
  }
}

export default injectSheet(styles)(Blog)
