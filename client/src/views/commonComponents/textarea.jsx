import React from 'react'
import injectSheet from 'react-jss'
import f from '../../util/f'

const styles = {}

class TextArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isValid: true,
      helper: '',
    }
    this.validators = {
      required: this.handleRequired,
      max: this.handleMax,
      min: this.handleMin,
    }
  }

  handleRequired = (value, v, message) => {
    const { isValid } = this.state
    if (!v) return true
    if (value.length > 0 && !isValid) {
      this.setState({ isValid: true })
      return true
    } if (value.length === 0) {
      this.setState({ isValid: false, helper: message })
      return false
    }
    return true
  }

  handleMax = (value, v, message) => {
    const { isValid } = this.state
    if (typeof v !== 'number') return true
    if (value.length <= v && !isValid) {
      this.setState({ isValid: true })
      return true
    } if (value.length > v) {
      this.setState({ isValid: false, helper: message })
      return false
    }
    return true
  }

  handleMin = (value, v, message) => {
    const { isValid } = this.state
    if (typeof v !== 'number') return true
    if (value.length >= v && isValid) {
      this.setState({ isValid: true })
      return true
    } if (value.length < v) {
      this.setState({ isValid: false, helper: message })
      return false
    }
    return true
  }

  validate = value => {
    const { rules } = this.props
    if (!Array.isArray(rules)) return true
    for (let i = 0; i < rules.length; ++i) {
      const name = f.getRuleName(rules[i])
      if (!this.validators[name](value, rules[i][name], rules[i].message)) {
        return false
      }
    }
    return true
  }

  handleValueChange = e => {
    const { onChange } = this.props
    const { value } = e.target
    this.validate(value)
    if (onChange) {
      onChange(value)
    }
  }

  componentDidMount() {
    const { bridge } = this.props
    if (bridge) {
      bridge.validate = this.validate
    }
  }

  render() {
    const {
      style, value, placeholder, className, defaultValue, disabled, rows, cols,
    } = this.props
    const { isValid, helper } = this.state
    return (
      <React.Fragment>
        <textarea
          className={`input-box ${isValid ? '' : 'warning'} ${className}`}
          placeholder={placeholder}
          onChange={this.handleValueChange}
          style={style}
          value={value}
          rows={rows}
          cols={cols}
          defaultValue={defaultValue}
          disabled={disabled}
        />
        <div className="helper" style={{ display: isValid ? 'none' : 'block' }}>
          {helper}
        </div>
      </React.Fragment>
    )
  }
}

export default injectSheet(styles)(TextArea)
