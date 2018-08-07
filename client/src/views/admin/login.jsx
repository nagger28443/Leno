import {
  React, post, fail, injectSheet,
} from 'src/commonExports'
import { Input, Button, message } from 'src/echo'

const styles = {
  root: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    padding: '1rem',
  },
  item: {
    margin: ['1rem', 0],
    display: 'block',
    width: '15rem',
    height: '2rem',
  },
}

class Login extends React.Component {
  handleSubmit = async (e) => {
    e.preventDefault()
    const values = Array.from(e.target).map(item => item.value.trim())
    try {
      await post('/admin/login', { name: values[0], password: values[1] })
      this.props.history.push('/admin/bloglist')
    } catch (err) {
      if (err.code === 2101) {
        message.error('User name or password invalid')
      } else if (err.code === 2110) {
        message.error('Account frozen')
      } else {
        fail(err)
      }
    }
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <form onSubmit={this.handleSubmit}>
          <Input className={classes.item} type="text" placeholder="User name" />
          <Input className={classes.item} type="password" placeholder="Password" />
          <Button className={classes.item} text="Sign in" type="submit" style={{ fontSize: 'smaller' }} />
        </form>
      </div>
    )
  }
}

export default injectSheet(styles)(Login)
