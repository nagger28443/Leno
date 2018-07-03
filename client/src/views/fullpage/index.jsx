import React from 'react'
import injectSheet from 'react-jss'
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
  },
}

class FullPage extends React.Component {
  getNameFromPath = path => /.*\/(.+?)\/*$/.exec(path)[1]
  componentDidMount() {
    document.documentElement.scrollIntoView()
    const { pathname } = this.props.location
    const name = this.getNameFromPath(pathname)
    // getBlogByName
    console.log(name)
  }

  render() {
    const { classes } = this.props
    return <article className={`blog ${classes.article}`}>{MDParser(article)}</article>
  }
}

export default injectSheet(styles)(FullPage)
