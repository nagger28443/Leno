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
  constructor() {
    super()
    this.name = ''
    this.password = ''
  }

  handleNameChange = value => {
    this.name = value.trim()
  }

  handlePasswordChange = value => {
    this.password = value.trim()
  }

  handleSubmit = async () => {
    try {
      await post('/admin/login', { name: this.name, password: this.password })
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
        <Input className={classes.item} type="text" placeholder="User name" onChange={this.handleNameChange} />
        <Input className={classes.item} type="password" placeholder="Password" onChange={this.handlePasswordChange} />
        <Button className={classes.item} text="Sign in" onClick={this.handleSubmit} style={{ fontSize: 'smaller' }} />
      </div>
    )
  }
}

export default injectSheet(styles)(Login)
