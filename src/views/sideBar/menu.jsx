import React from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { TOPBAR } from '../../constants'

const Menu = inject('appStore')(
  observer(({ appStore }) => (
    <ul className="menu">
      <li className="menu-item">
        <Link to="/" className="menu-link">
          Home
        </Link>
      </li>
      <li className="menu-item">
        <Link to="/archive" className="menu-link">
          Archive
        </Link>
      </li>
      <li className="menu-item">
        <Link to="/labels" className="menu-link">
          Labels
        </Link>
      </li>
      <li
        className="menu-item"
        style={{ display: appStore.barType === TOPBAR ? 'inline-block' : 'none' }}>
        <Link to="/about" className="menu-link">
          About
        </Link>
      </li>
    </ul>
  )),
)

export default Menu
