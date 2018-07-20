import { React, injectSheet, inject, observer, action, Link, get, fail } from 'src/commonExports' //eslint-disable-line

const styles = {
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: '#000000cc',
    transition: 'transform 0.5s',
  },
  labels: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    minWidth: '30rem',
    maxWidth: '45rem',
    width: '70%',
    height: '70%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 'x-large',
    margin: '2rem',
    color: '#b397bb',
    textDecoration: 'none',
    animationName: 'swing',
    animationDuration: '1.5s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  '@keyframes swing': {
    '25%': {
      transform: 'rotate(15deg)',
    },
    '75%': {
      transform: 'rotate(-15deg)',
    },
  },
}

@inject('labelStore')
@observer
class LabelModal extends React.Component {
  state = {
    labels: [],
  }

  componentDidMount() {
    get('/label/list')
      .then(action(resp => {
        this.setState({
          labels: resp.result,
        })
      }))
      .catch(err => {
        fail(err)
      })
  }

  render() {
    const { labelStore, classes } = this.props
    const { isLabelModalVisible, hideLabelModal } = labelStore
    const { labels } = this.state
    return (
      <div
        className={classes.root}
        style={{ transform: isLabelModalVisible ? 'scale(1)' : 'scale(0)' }}
        onClick={hideLabelModal}
      >
        <div className={classes.labels}>
          {labels.map(label => (
            <Link
              to={`/list?labels=${label.name}`}
              key={label.id}
              onClick={hideLabelModal}
              className={classes.label}
            >
              {label.name}({label.count})
            </Link>
          ))}
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(LabelModal)
