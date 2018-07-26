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

const Menu = inject('labelStore')(observer(({ labelStore, classes }) => (
  <ul className={classes.menu}>
    <li className={classes.menuItem}>
      <Link to="/list?archive=all" className="plain-link">
          ARCHIVE
      </Link>
    </li>
    <li className={classes.menuItem}>
      <Link to="/category" className="plain-link">
          CATEGORY
      </Link>
    </li>
    <li className={classes.menuItem}>
      <span className="plain-link" onClick={labelStore.showLabelModal}>
          LABEL
      </span>
    </li>
    <li className={classes.menuItem}>
      <Link to="/about" className="plain-link">
          ABOUT
      </Link>
    </li>
    <LabelModal />
  </ul>
)))

export default injectSheet(styles)(Menu)
