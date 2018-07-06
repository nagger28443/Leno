import React from 'react'
import injectSheet from 'react-jss'
import { action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Detail } from '../../styledComponents'
import article from '../../blogs/1.md'
import MDParser from '../../util/MDParser'
import BlogHeader from '../commonComponents/blogHeader'

const styles = {}

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
    // console.log(store.blogContent)
    // ajax成功回调
    // this.generateAnchors(store.blogContent)
  }

  render() {
    return (
      <Detail style={{ paddingTop: 0 }}>
        <article style={{ paddingTop: '4rem' }}>
          <BlogHeader
            data={{
              title: '(小结)React中实现离开页面确认提示',
              date: '2018-07-05',
              category: 'coding',
              tags: ['React', 'React-Router'],
            }}
          />
          {store.blogContent}
        </article>
      </Detail>
    )
  }
}

export default injectSheet(styles)(FullPage)
