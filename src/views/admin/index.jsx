import React from 'react'
import { get } from '../../util/http'

class Admin extends React.Component {
  name = ''
  password = ''
  handleNameChange = e => {
    this.name = e.target.value
  }
  handlePasswordChange = e => {
    this.password = e.target.value
  }
  handleSubmit = () => {
    get('/login', { name: this.name, password: this.password })
      .then(resp => {
        console.log(resp)
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <div>
        用户名：<input type="text" onChange={this.handleNameChange} />
        密码：<input type="password" onChange={this.handlePasswordChange} />
        <button onClick={this.handleSubmit}>登录</button>
      </div>
    )
  }
}

export default Admin
