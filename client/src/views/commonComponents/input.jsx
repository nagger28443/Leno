import React from 'react'
import injectSheet from 'react-jss'
import f from '../../util/f'

const styles = {}

class Input extends React.Component {
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
    if (!v) return true
    if (value.length > 0 && !this.state.isValid) {
      this.setState({ isValid: true })
      return true
    } if (value.length === 0) {
      this.setState({ isValid: false, helper: message })
      return false
    }
    return true
  }

  handleMax = (value, v, message) => {
    if (typeof v !== 'number') return true
    if (value.length <= v && !this.state.isValid) {
      this.setState({ isValid: true })
      return true
    } if (value.length > v) {
      console.log(value)
      this.setState({ isValid: false, helper: message })
      return false
    }
    return true
  }

  handleMin = (value, v, message) => {
    if (typeof v !== 'number') return true
    if (value.length >= v && !this.state.isValid) {
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
    if (!Array.isArray(rules)) return
    for (let i = 0; i < rules.length; ++i) {
      const name = f.getRuleName(rules[i])
      if (!this.validators[name](value, rules[i][name], rules[i].message)) {
        return false //eslint-disable-line
      }
    }
    return true//eslint-disable-line
  }

  handleValueChange = e => {
    const value = e.target.value.trim()
    this.validate(value)
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  componentDidMount() {
    if (this.props.bridge) {
      this.props.bridge.validate = this.validate
    }
  }

  render() {
    const {
      style, value, placeholder, className, defaultValue, disabled,
    } = this.props
    const { isValid, helper } = this.state
    return (
      <React.Fragment>
        <input
          className={`input-box ${isValid ? '' : 'warning'} ${className}`}
          placeholder={placeholder}
          onChange={this.handleValueChange}
          style={style}
          value={value}
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

export default injectSheet(styles)(Input)
