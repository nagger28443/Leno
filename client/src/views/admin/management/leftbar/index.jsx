import { React, injectSheet,inject, observer, get } from 'src/commonExports' //eslint-disable-line

const styles = {
  root: {},
}

class Leftbar extends React.Component {
  componentDidMount() {}
  render() {
    const { clazz, root } = this.props
    return <sider className={`${clazz} ${root}`}>leftbar</sider>
  }
}

export default injectSheet(styles)(Leftbar)
