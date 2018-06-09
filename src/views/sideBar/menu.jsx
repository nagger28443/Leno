import React from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'

const Menu = () => (
  <ul className="menu">
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/catalog">Archive</Link>
    </li>
    <li>
      <Link to="/tags">Labels</Link>
    </li>
  </ul>
)

export default Menu
