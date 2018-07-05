import React from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'
import LabelModal from './labelModal'

const styles = {
  menu: {
    padding: 0,
    fontSize: 'smaller',
    color: '#073e5b',
  },

  menuItem: {
    display: 'inline-block',
    margin: ['0.5rem', '1rem', '0.5rem', 0],
  },

  '@media (max-width: 1200px)': {
    menu: {
      float: 'right',
    },
  },
}

const Menu = inject('appStore', 'labelStore')(
  observer(({ labelStore, classes }) => (
    <ul className={classes.menu}>
      {/* <li className={classes.menuItem}>
        <Link to="/" className="plain-link">
          首页
        </Link>
      </li> */}
      <li className={classes.menuItem}>
        <Link to="/archive" className="plain-link">
          归档
        </Link>
      </li>
      <li className={classes.menuItem}>
        <Link to="/category" className="plain-link">
          分类
        </Link>
      </li>
      <li className={classes.menuItem}>
        <span className="plain-link" onClick={labelStore.showLabelModal}>
          标签
        </span>
      </li>
      <li className={classes.menuItem}>
        <Link to="/about" className="plain-link">
          关于
        </Link>
      </li>
      <LabelModal />
    </ul>
  )),
)

export default injectSheet(styles)(Menu)
