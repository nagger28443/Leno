import React from 'react'
import injectSheet from 'react-jss'
import { Link } from 'react-router-dom'
import { action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Detail } from '../../styledComponents'
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
  title: {
    fontSize: 'x-large',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  info: {
    fontSize: 'smaller',
    textAlign: 'center',
    '& span': {
      margin: [0, '0.5rem'],
    },
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
    return (
      <Detail>
        <header className={classes.title}>(小结)React中实现离开页面确认提示</header>
        <p className={classes.info}>
          <span>发表于：2018-07-05</span>
          <span>
            分类：
            <Link to="/category/coding" className="link">
              coding
            </Link>
          </span>
          <span>
            标签：
            <Link to="/label/React" className="link">
              React
            </Link>,
            <Link to="/label/React-Router" className="link">
              React-Router
            </Link>
          </span>
        </p>
        <article className={`blog ${classes.article}`}>{store.blogContent}</article>
      </Detail>
    )
  }
}

export default injectSheet(styles)(FullPage)
