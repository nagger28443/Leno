import { React, injectSheet,inject, observer, get } from 'src/commonExports' //eslint-disable-line

const styles = {
  root: {},
}

class Leftbar extends React.Component {
  componentDidMount() {}

  render() {
    const { clazz, root } = this.props
    return (
      <sider className={`${clazz} ${root}`}>
        <div>菜单</div>
        <div>
          <div>博客统计</div>
          <div>文章管理</div>
          <div>分类管理</div>
          <div>博客设置</div>
        </div>
      </sider>
    )
  }
}

export default injectSheet(styles)(Leftbar)
