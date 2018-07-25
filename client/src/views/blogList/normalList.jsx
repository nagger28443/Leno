import {
  React, injectSheet, inject, observer,
} from 'src/commonExports'
import BlogListItem from '../commonComponents/blogListItem'

const styles = {}

@inject('blogListStore')
@observer
class BlogList extends React.Component {
  render() {
    const { data } = this.props.blogListStore
    return (
      <React.Fragment>
        {data.map(item => <BlogListItem data={item} key={item.id} />)}
      </React.Fragment>
    )
  }
}
export default injectSheet(styles)(BlogList)
