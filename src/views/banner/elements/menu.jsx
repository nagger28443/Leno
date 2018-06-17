import React from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'
import { TOPBAR } from '../../../constants'

const styles = {
  menu: {
    padding: 0,
    textAlign: 'left',
    fontSize: 'smaller',
    color: '#073e5b',
    minWidth: '12rem',
  },

  menuItem: {
    display: 'inline-block',
    margin: ' 0.5rem',
    '&:hover': {
      transition: ['0.5s', 'transform'],
      transform: 'scale(1.1)',
    },
  },

  menuLink: {
    textDecoration: 'none',
  },

  '@media (max-width: 1200px)': {
    menu: {
      float: 'right',
    },
  },
}

const Menu = inject('appStore')(
  observer(({ appStore, classes }) => (
    <ul className={classes.menu}>
      <li className={classes.menuItem}>
        <Link to="/" className={classes.menuLink}>
          Home
        </Link>
      </li>
      <li className={classes.menuItem}>
        <Link to="/archive" className={classes.menuLink}>
          Archive
        </Link>
      </li>
      <li className={classes.menuItem}>
        <Link to="/labels" className={classes.menuLink}>
          Labels
        </Link>
      </li>
      <li
        className={classes.menuItem}
        style={{ display: appStore.barType === TOPBAR ? 'inline-block' : 'none' }}>
        <Link to="/about" className={classes.menuLink}>
          About
        </Link>
      </li>
    </ul>
  )),
)

export default injectSheet(styles)(Menu)
