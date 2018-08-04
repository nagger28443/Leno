import React from 'react'
import injectSheet from 'react-jss'
import { Detail } from '../../styledComponents'
import { mottos } from '../../../projectConfig'

const styles = {}

const mottoStr = mottos.map(m => m.join('$')).join('%')
class About extends React.Component {
  constructor() {
    super()
    this.state = {
      mts: '',
    }
  }

  output = () => {
    const { mts } = this.state
    if (mts.length >= mottoStr.length) return

    this.setState({ mts: mottoStr.slice(0, mts.length + 1) }, () => {
      setTimeout(() => {
        this.output()
      }, 50)
    })
  }

  componentDidMount() {
    document.documentElement.scrollIntoView()
    this.output()
  }

  render() {
    return (
      <Detail>
        {this.state.mts.split('%').map((m, index) => (
          /* eslint-disable */
          <div key={`${index}`} style={{ margin: '2rem 0' }}>{m.split('$').map((t, i) => <p key={`${index}${i}`}>{t}</p>)}</div>
          /* eslint-enable */
        ))}
      </Detail>
    )
  }
}
export default injectSheet(styles)(About)
