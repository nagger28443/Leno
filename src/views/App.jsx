import React from 'react'
import SideBar from './sideBar'
import Contnets from './contents'

export default class App extends React.Component {
  handleClick = () => {}
  render() {
    return (
      <React.Fragment>
        <SideBar />
        <Contnets />
      </React.Fragment>
    )
  }
}
