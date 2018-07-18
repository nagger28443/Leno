import { React, injectSheet,inject, observer, get } from 'src/commonExports' //eslint-disable-line
import Labels from './labels'
import Category from './category'
import blog from '../../../../../blogs/2.md'

const styles = {
  row: {
    margin: '1rem',
  },

  title: {
    width: '100%',
  },
  content: {
    width: '100%',
    height: '30rem',
    lineHeight: 1.7,
    padding: '1rem',
  },
  label: {
    margin: [0, '0.3rem'],
    cursor: 'pointer',
  },
}
class BlogEditor extends React.Component {
  state = {}

  componentDidMount() {}
  render() {
    const { classes } = this.props
    // const { } = this.state
    return (
      <div className={classes.root}>
        <div className={classes.row}>
          <input
            type="text"
            placeholder="请输入文章标题"
            className={`input-box ${classes.title}`}
          />
        </div>
        <div className={classes.row}>
          <textarea
            cols="30"
            rows="10"
            required
            className={`input-box ${classes.content}`}
            defaultValue={blog}
          />
        </div>
        <div style={{ fontSize: 'small' }}>
          <div className={classes.row}>
            <Labels />
          </div>
          <div className={classes.row}>
            <Category />
          </div>
          <div className={classes.row}>分类</div>
          <div className={classes.row}>私密</div>
        </div>
        <div className={classes.row}>按钮</div>
      </div>
    )
  }
}

export default injectSheet(styles)(BlogEditor)
