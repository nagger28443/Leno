import { React, injectSheet, Link } from 'src/commonExports'

const styles = {
  root: {},
  title: {
    color: '#bbb',
    fontSize: 'smaller',
    padding: ['1rem', '2.5rem'],
  },
  menuContainer: {
  },
  menu: {
    padding: ['0.6rem', '3.2rem'],
    display: 'block',
    textDecoration: 'none',
    '&:hover': {
      background: '#f5f5f5',
    },
    '&:active': {
      opacity: 0.7,
    },
  },

}

const menu = [
  {
    title: '博客统计',
    link: '/admin/statistics',
  },
  {
    title: '文章管理',
    link: '/admin/blog/list',
  },
  {
    title: '分类管理',
    link: '/admin/category',
  },
  {
    title: '博客设置',
    link: '/admin/settings',
  },
]

class Leftbar extends React.Component {
  componentDidMount() {}

  render() {
    const { clazz, root, classes } = this.props
    return (
      <sider className={`${clazz} ${root}`}>
        <div className={classes.title}>菜单</div>
        <nav className={classes.menuContainer}>
          {
            menu.map(item => <Link to={item.link} className={classes.menu}>{item.title}</Link>)
          }
        </nav>
      </sider>
    )
  }
}

export default injectSheet(styles)(Leftbar)
