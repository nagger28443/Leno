import React from 'react'
import injectSheet from 'react-jss'
import { Detail } from '../../styledComponents'

const styles = {}

class About extends React.Component {
  componentDidMount() {
    document.documentElement.scrollIntoView()
  }

  render() {
    return (
      <Detail>
        About
      </Detail>
    )
  }
}
export default injectSheet(styles)(About)
