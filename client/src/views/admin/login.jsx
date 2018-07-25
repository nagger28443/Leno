import { React, post, fail } from 'src/commonExports'

class Login extends React.Component {
  constructor() {
    super()
    this.name = ''
    this.password = ''
  }

  handleNameChange = e => {
    this.name = e.target.value.trim()
  }

  handlePasswordChange = e => {
    this.password = e.target.value.trim()
  }

  handleSubmit = () => {
    post('/admin/login', { name: this.name, password: this.password })
      .then(() => {
        this.props.history.push('/admin')
        console.log(document.cookie)
      })
      .catch(err => {
        if (err.code === 2101) {
          // 用户名或密码错误
          console.log('密码错误')
        } else if (err.code === 2110) {
          // frozen
          console.log('账户冻结')
        } else {
          fail(err)
        }
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
