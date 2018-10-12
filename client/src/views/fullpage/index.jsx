import {
  React, injectSheet, runInAction, observer, inject, get, observable, action,
} from 'src/commonExports'
import { Detail } from '../../styledComponents'
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

  @observable isLoading = true

  @observable data= {
    labels: '',
  }

  pathDecode = path => /^\/+blog\/+(\d{4}\/+\d{2}\/+\d{2})\/+(.+)$/.exec(path)

  @action
  componentWillUnmount() {
    store.blogContent = ''
  }

  async componentDidMount() {
    document.documentElement.scrollIntoView()
    const { pathname } = this.props.location
    const pathParams = this.pathDecode(pathname)
    if (!pathParams) {
      return
    }
    const date = pathParams[1].split(/\/+/).join('-')
    const title = pathParams[2]

    const data = await get('/blog', { date, title })
    runInAction(() => {
      store.blogContent = data.content
      this.isLoading = false
      this.data = data
    })
  }

  render() {
    const { data, isLoading } = this
    if (isLoading) {
      return <Detail><div className="loading" /></Detail>
    }
    return (
      <Detail style={{ paddingTop: 0 }}>
        <article style={{ paddingTop: '4rem' }}>
          <BlogHeader data={data} />
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
        </article>
      </Detail>
    )
  }
}

export default injectSheet(styles)(FullPage)
