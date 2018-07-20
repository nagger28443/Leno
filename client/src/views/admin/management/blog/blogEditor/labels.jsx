import { React, injectSheet,inject, observer, get, action } from 'src/commonExports' //eslint-disable-line

const styles = {
  label: {
    marginRight: '0.6rem',
    cursor: 'pointer',
  },
}

let store

@inject('blogEditorStore')
@observer
class Labels extends React.Component {
  constructor(props) {
    super(props)
    this.input = React.createRef()
    store = props.blogEditorStore
    this.state = {
      isLabelInputVisible: false,
    }
  }

  @action
  handleLabelRemove = e => {
    const index = e.target.getAttribute('index')
    store.labels.splice(index, 1)
  }

  showLabelInput = () => {
    this.setState(
      {
        isLabelInputVisible: true,
      },
      () => {
        this.input.current.focus()
      },
    )
  }

  @action
  handleLabelConfirm = e => {
    const value = e.target.value.trim()
    e.target.value = ''
    if (value.length > 0) {
      const { labels } = store
      if (!labels.includes(value)) {
        labels.push(value)
      }
    }
    this.setState({ isLabelInputVisible: false })
  }

  componentDidMount() {}

  render() {
    const { classes } = this.props
    const { isLabelInputVisible } = this.state
    const { labels } = store
    return (
      <div>
        <span>文章标签：</span>
        <span>
          {labels.map((label, index) => (
            <span
              className={`input-box ${classes.label}`}
              title="点击删除"
              index={index}
              key={label}
              onClick={this.handleLabelRemove}
            >
              {label}
            </span>
          ))}
          <input
            className="input-box"
            ref={this.input}
            style={{ display: isLabelInputVisible ? 'inline-block' : 'none', width: '6rem' }}
            onBlur={this.handleLabelConfirm}
          />
          <span
            className="link"
            onClick={this.showLabelInput}
            style={{ marginLeft: '0.3rem', display: labels.length < 6 ? 'inline-block' : 'none' }}
          >
            添加
          </span>
        </span>
      </div>
    )
  }
}

export default injectSheet(styles)(Labels)
