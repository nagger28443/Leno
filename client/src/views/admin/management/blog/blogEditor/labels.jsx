import {
  React, injectSheet, inject, observer, action, fail, get,
} from 'src/commonExports'
import Input from '../../../../../echo/input'

const styles = {
  labels: {
    display: 'inline-block',
    position: 'relative',
    zIndex: 15,
  },
  label: {
    marginRight: '0.6rem',
    cursor: 'pointer',
  },
  dropDown: {
    background: '#f5f5f5',
    width: '10rem',
    position: 'absolute',
    top: '2rem',
    left: 0,
    maxHeight: '10rem',
    overflow: 'auto',
  },
  dropDownLabel: {
    height: '1.3rem',
    cursor: 'pointer',
  },
}

let store

@inject('blogEditorStore')
@observer
class Labels extends React.Component {
  constructor(props) {
    super(props)
    this.allLabels = []
    this.labelInput = ''
    store = props.blogEditorStore
    this.state = {
      dropDownLabels: [],
      isLabelInputVisible: false,
      isDropDownVisible: false,
    }
  }

  handleInputFocus = () => {
    this.setState({ isDropDownVisible: true })
  }

  handleInputChange = value => {
    this.labelInput = value.trim()
    const inputRegex = new RegExp(`.*${this.labelInput}.*`, 'i')
    const dropDownLabels = this.allLabels.filter(c => inputRegex.test(c.name))
    this.setState({ dropDownLabels })
  }

  fetchLabels = () => {
    get('/label/list')
      .then(resp => {
        this.allLabels = resp.result
        this.setState({ dropDownLabels: resp.result })
      })
      .catch(err => {
        fail(err)
      })
  }

  @action
  handleLabelRemove = e => {
    const index = e.target.getAttribute('data-index')
    store.labels.splice(index, 1)
  }

  showLabelInput = () => {
    this.setState({
      isLabelInputVisible: true,
    })
  }

  handleInputBlur = (e) => {
    e.target.value = ''
    setTimeout(() => {
      this.handleLabelConfirm(this.labelInput)
    }, 100)
  }

  handleLabelChoose = (e) => {
    this.labelInput = e.target.innerText
    setTimeout(() => {
      this.setState({
        isDropDownVisible: false,
      })
    }, 100)
  }

  @action
  handleLabelConfirm = (value) => {
    this.labelInput = ''
    if (value.length > 0) {
      const { labels } = store
      if (!labels.includes(value)) {
        labels.push(value)
      }
    }
    this.setState({
      isLabelInputVisible: false,
    })
  }

  componentDidMount() {
    this.fetchLabels()
  }

  render() {
    const { classes } = this.props
    const { isLabelInputVisible, isDropDownVisible, dropDownLabels } = this.state
    const { labels } = store
    return (
      <div>
        <span style={{
          display: 'inline-block', width: '5rem', textAlign: 'right', marginRight: '0.5rem',
        }}
        >Labels:
        </span>
        <span>
          {labels.map((label, index) => (
            <span
              className={`input-box ${classes.label}`}
              title="点击删除"
              data-index={index}
              key={label}
              onClick={this.handleLabelRemove}
            >
              {label}
            </span>
          ))}
          <div className={classes.labels} style={{ display: isLabelInputVisible ? 'inline-block' : 'none' }}>
            <Input
              type="text"
              placeholder="Search or insert"
              boxStyle={{ width: '10rem' }}
              onFocus={this.handleInputFocus}
              onBlur={this.handleInputBlur}
              onChange={this.handleInputChange}
            />
            <div
              className={`input-box ${classes.dropDown}`}
              style={{ display: isDropDownVisible && dropDownLabels.length > 0 ? 'block' : 'none' }}
            >
              {dropDownLabels.map(c => (
                <div className={classes.dropDownLabel} id="label-drop-down" key={c.id} onClick={this.handleLabelChoose}>
                  {c.name}
                </div>
              ))}
            </div>
          </div>
          <span
            className="link"
            onClick={this.showLabelInput}
            style={{ marginLeft: '0.3rem', display: labels.length < 6 ? 'inline-block' : 'none' }}
          >
            Add
          </span>
        </span>
      </div>
    )
  }
}

export default injectSheet(styles)(Labels)
