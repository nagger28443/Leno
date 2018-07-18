import { React, injectSheet,inject, observer, get } from 'src/commonExports' //eslint-disable-line

const styles = {
  root:{
    display:flex
  }
}
class BlogEditor extends React.Component {
  componentDidMount() {}
  render() {
    return (
      <div>
        <input type="text" placeholder="请输入文章标题" />
        <textarea cols="30" rows="10" required />
      </div>
    )
  }
}

export default injectSheet(styles)(BlogEditor)
