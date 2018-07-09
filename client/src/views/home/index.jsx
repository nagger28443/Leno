import React from 'react'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'
import _ from 'lodash'
import Blog from './blog'

const styles = {}
@inject('appStore')
@observer
class Home extends React.Component {
  getData = () => {}
  handleScroll = () => {
    const curHeight = window.pageYOffset
    const maxHeight = document.body.clientHeight
    const windowHeight = window.outerHeight
    if (maxHeight - curHeight - windowHeight < 500) {
      this.getData()
    }
  }
  componentDidMount() {
    document.documentElement.scrollIntoView()
    window.addEventListener('scroll', _.throttle(this.handleScroll, 500), false)
  }
  render() {
    return (
      <React.Fragment>
        <Blog />
        <Blog />
        <Blog />
        <Blog />
        <Blog />
      </React.Fragment>
    )
  }
}

export default injectSheet(styles)(Home)
