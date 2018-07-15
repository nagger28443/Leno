import { React, injectSheet, inject, observer } from 'src/commonExports' //eslint-disable-line
import Blog from './blog'

const styles = {}

@inject('blogListStore')
@observer
class Home extends React.Component {
  render() {
    const { data } = this.props.blogListStore
    return <React.Fragment>{data.map(item => <Blog data={item} key={item.id} />)}</React.Fragment>
  }
}
export default injectSheet(styles)(Home)
