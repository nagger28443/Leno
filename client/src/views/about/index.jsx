import React from 'react'
import injectSheet from 'react-jss'
import { Detail } from '../../styledComponents'
import { mottos } from '../../../projectConfig'
import {
  observable, action, observer, _,
} from '../../commonExports'

const styles = {}

const mottoStr = mottos.map(m => m.join('$')).join('%')
@observer
class About extends React.Component {
  @observable mts = []

  @action
  output = (len) => {
    if (len > mottoStr.length) return
    this.mts = mottoStr.slice(0, len).split('%').map((m) => m.split('$'))
    _.delay(this.output, 50, len + 1)
  }

  componentDidMount() {
    document.documentElement.scrollIntoView()
    this.output(1)
  }

  render() {
    return (
      <Detail>
        {this.mts.map((m, index) => (
          /* eslint-disable */
          <div key={`${index}`} style={{ margin: '2rem 0' }}>{m.map((t, i) => <p key={`${index}${i}`}>{t}</p>)}</div>
          /* eslint-enable */
        ))}
      </Detail>
    )
  }
}
export default injectSheet(styles)(About)
