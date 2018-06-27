import React from 'react'
import injectSheet from 'react-jss'
import { inject, observer } from 'mobx-react'
// import { observable, action } from 'mobx'
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

inject('appStore')
@observer
class FullPage extends React.Component {
  componentDidMount() {
    document.documentElement.scrollIntoView()
  }
  render() {
    const { classes } = this.props
    return <article className={`blog ${classes.article}`}>{MDParser(article)}</article>
  }
}

export default injectSheet(styles)(FullPage)
