import React from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import injectSheet from 'react-jss'

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

const LabelModal = inject('appStore', 'labelStore')(
  observer(({ labelStore, classes }) => (
    <div
      className={classes.root}
      style={{ ...labelStore.style }}
      // style={{ display: labelStore.isLabelModalVisible ? 'block' : 'none' }}
      onClick={labelStore.hideLabelModal}>
      <div className={classes.labels}>
        <Link to="/labels" onClick={labelStore.hideLabelModal} className={classes.label}>
          123
        </Link>
        <Link to="/labels" onClick={labelStore.hideLabelModal} className={classes.label}>
          123
        </Link>
        <Link to="/labels" onClick={labelStore.hideLabelModal} className={classes.label}>
          123
        </Link>
        <Link to="/labels" onClick={labelStore.hideLabelModal} className={classes.label}>
          123
        </Link>
        <Link to="/labels" onClick={labelStore.hideLabelModal} className={classes.label}>
          123
        </Link>
        <Link to="/labels" onClick={labelStore.hideLabelModal} className={classes.label}>
          123
        </Link>
        <Link to="/labels" onClick={labelStore.hideLabelModal} className={classes.label}>
          123
        </Link>
        <Link to="/labels" onClick={labelStore.hideLabelModal} className={classes.label}>
          123
        </Link>
        <Link to="/labels" onClick={labelStore.hideLabelModal} className={classes.label}>
          123
        </Link>
        <Link to="/labels" onClick={labelStore.hideLabelModal} className={classes.label}>
          123
        </Link>
      </div>
    </div>
  )),
)

export default injectSheet(styles)(LabelModal)
