import {
  React, injectSheet, inject, observer, action,
} from 'src/commonExports'

const styles = {
  switchContainer: {
    display: 'inline-block',
    width: '2rem',
    height: '1rem',
    borderRadius: '0.8rem',
    verticalAlign: 'bottom',
    position: 'relative',
    cursor: 'pointer',

    background: 'red',
  },
  switch: {
    width: '0.7rem',
    height: '0.7rem',
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    transition: '0.5s left',
  },
}

let store

@inject('blogEditorStore')
@observer
class Category extends React.Component {
  constructor(props) {
    super(props)
    store = props.blogEditorStore
  }

  @action
  handleSwitch = () => {
    store.isPrivate = !store.isPrivate
  }

  componentDidMount() {}

  render() {
    const { classes } = this.props
    const { isPrivate } = store

    return (
      <div>
        <span>私密文章：</span>
        <div
          className={classes.switchContainer}
          onClick={this.handleSwitch}
          style={{ background: isPrivate ? '#7ED321' : '#d1d5da' }}
        >
          <div
            className={classes.switch}
            style={{
              left: isPrivate ? '1.1rem' : '0.2rem',
            }}
          />
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Category)
