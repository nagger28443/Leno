import React from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'

const Menu = () => (
  <ul className="menu">
    <li>
      <Link to="/">首页</Link>
    </li>
    <li>
      <Link to="/catalog">目录</Link>
    </li>
    <li>
      <Link to="/tags">标签</Link>
    </li>
  </ul>
)

export default Menu
