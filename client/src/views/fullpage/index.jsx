import React from 'react'
import injectSheet from 'react-jss'
import { action } from 'mobx'
import { observer, inject } from 'mobx-react'
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

let store
@inject('appStore')
@observer
class FullPage extends React.Component {
  constructor(props) {
    super(props)
    store = props.appStore
  }

  getNameFromPath = path => /.*\/(.+?)\/*$/.exec(path)[1]

  @action
  componentDidMount() {
    document.documentElement.scrollIntoView()

    // const { pathname } = this.props.location
    // const name = this.getNameFromPath(pathname)
    // getBlogByName
    // console.log(name)

    store.blogContent = MDParser(article)
    this.forceUpdate()
    // console.log(store.blogContent)
    // ajax成功回调
    // this.generateAnchors(store.blogContent)
  }

  render() {
    const { classes } = this.props
    return <article className={`blog ${classes.article}`}>{store.blogContent}</article>
  }
}

export default injectSheet(styles)(FullPage)
