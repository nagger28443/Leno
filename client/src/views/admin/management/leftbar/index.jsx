import { React, injectSheet, Link } from 'src/commonExports'
import { withRouter } from 'react-router-dom'

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
  active: {
    background: '#f5f5f5',
  },

}

const menu = [
  {
    title: 'Stats',
    link: '/admin/statistics',
    match: /\/admin\/statistics/,
  },
  {
    title: 'Posts',
    link: '/admin/blog/list',
    match: /\/admin\/(blog|draft)/,
  },
  {
    title: 'Categories',
    link: '/admin/category',
    match: /\/admin\/category/,
  },
  {
    title: 'Settings',
    link: '/admin/settings',
    match: /\/admin\/settings/,
  },
]

class Leftbar extends React.Component {
  state={
    curPath: '',
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { pathname } = nextProps.location
    const { curPath } = prevState
    if (pathname !== curPath) {
      return {
        curPath: pathname,
      }
    }
    return null
  }

  render() {
    const { clazz, root, classes } = this.props
    const { curPath } = this.state
    return (
      <sider className={`${clazz} ${root}`}>
        <div className={classes.title}>Menu</div>
        <nav className={classes.menuContainer}>
          {
            menu.map(item => (
              <Link
                to={item.link}
                className={`${classes.menu} ${item.match.test(curPath) ? classes.active : ''}`}
              >
                {item.title}
              </Link>
            ))
          }
        </nav>
      </sider>
    )
  }
}

export default withRouter(injectSheet(styles)(Leftbar))
