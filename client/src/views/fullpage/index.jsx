import React from 'react'
import injectSheet from 'react-jss'
import { action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Detail } from '../../styledComponents'
import article from '../../blogs/2.md'
import { get } from '../../util/http'
import BlogHeader from '../commonComponents/blogHeader'
import { fail } from '../../util/utils'

const styles = {}

let store
@inject('appStore')
@observer
class FullPage extends React.Component {
  constructor(props) {
    super(props)
    store = props.appStore
    this.state = {
      data: {
        labels: '',
      },
    }
  }

  pathDecode = path => /^\/+blog\/+(\d{4}\/+\d{2}\/+\d{2})\/+(.+)$/.exec(path)
  getNameFromPath = path => /.*\/(.+?)\/*$/.exec(path)[1]

  @action
  componentDidMount() {
    document.documentElement.scrollIntoView()
    const { pathname } = this.props.location
    const pathParams = this.pathDecode(pathname)
    if (!pathParams) {
      return
    }
    const date = pathParams[1].split(/\/+/).join('-')
    const title = pathParams[2]

    get('/blog', {
      date,
      title,
    })
      .then(
        action(resp => {
          store.blogContent = resp.content
          this.setState({
            data: resp,
          })
        }),
      )
      .catch(err => {
        fail(err)
      })
  }

  render() {
    const { data } = this.state
    return (
      <Detail style={{ paddingTop: 0 }}>
        <article style={{ paddingTop: '4rem' }}>
          <BlogHeader data={data} />
          {/* eslint-disable */}
          <div dangerouslySetInnerHTML={{ __html: data.content }} /> 
          {/* eslint-enable */}
        </article>
      </Detail>
    )
  }
}

export default injectSheet(styles)(FullPage)
