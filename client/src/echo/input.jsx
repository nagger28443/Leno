import React from 'react'
import injectSheet from 'react-jss'
import f from '../util/f'

const styles = {
  inputRoot: {
    display: 'inline-block',
  },
}

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
    const { value } = e.target
    this.validate(value.trim())
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  handleBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur()
    }
  }

  componentDidMount() {
    if (this.props.bridge) {
      this.props.bridge.validate = this.validate
    }
  }

  render() {
    const {
      boxStyle, inputStyle, type = 'text', value, placeholder, className = '', defaultValue, disabled, autoFocus,
    } = this.props
    const { isValid, helper } = this.state
    const { classes } = this.props
    return (
      <div style={boxStyle} className={`${classes.inputRoot} ${className}`}>
        <input
          className={`input-box ${isValid ? '' : 'warning'}`}
          placeholder={placeholder}
          type={type}
          onChange={this.handleValueChange}
          onBlur={this.handleBlur}
          style={{ width: '100%', height: '100%', ...inputStyle }}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          autoFocus={!!autoFocus} //eslint-disable-line
        />
        <div className="helper" style={{ display: isValid ? 'none' : 'block' }}>
          {helper}
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Input)
