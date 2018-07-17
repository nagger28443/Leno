import React from 'react'
import { post } from '../../util/http'

class Login extends React.Component {
  name = ''
  password = ''
  handleNameChange = e => {
    this.name = e.target.value.trim()
  }
  handlePasswordChange = e => {
    this.password = e.target.value.trim()
  }
  handleSubmit = e => {
    e.preventDefault()
    post('/admin/login', { name: this.name, password: this.password })
      .then(() => {
        this.props.history.replace('/admin')
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <div>
        <div>
          用户名：<input type="text" onChange={this.handleNameChange} />
        </div>
        <div>
          密码：<input type="password" onChange={this.handlePasswordChange} />
        </div>
        <button onClick={this.handleSubmit}>登录</button>
      </div>
    )
  }
}

export default Login
