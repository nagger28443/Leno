import React from 'react'
import { get } from '../../util/http'

class Login extends React.Component {
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
    return 'login'
  }
}

export default Login
