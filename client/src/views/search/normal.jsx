import { React, injectSheet, _, get, fail, f, inject, observer, action  } from 'src/commonExports' //eslint-disable-line
import BlogListItem from '../commonComponents/blogListItem'

const styles = {}

let store
@inject('blogListStore')
@observer
class BlogList extends React.Component {
  constructor(props) {
    super(props)
    store = props.blogListStore
    this.curPage = 0
  }

  getData = () => {
    const { query } = store
    get('/blog/list', {
      ...query,
      page: ++this.curPage,
    })
      .then(
        action(resp => {
          store.totalCount = resp.totalCount
          store.data = [...store.data, ...resp.result]
        }),
      )
      .catch(err => {
        fail(err)
      })
  }

  componentDidMount() {
    store.getData = this.getData
  }

  render() {
    const { data } = store
    console.log(data.slice())
    return (
      <React.Fragment>
        {data.map(item => <BlogListItem data={item} key={item.id} />)}
      </React.Fragment>
    )
  }
}
export default injectSheet(styles)(BlogList)
