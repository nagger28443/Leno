import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'mobx-react'
import { configure } from 'mobx'
import 'babel-polyfill'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import axios from 'axios'
import App from './views/App'
import appStore from './store/appStore'
import labelStore from './store/banner/labelStore'
import blogListStore from './store/blogList/blogListStore'
import blogEditorStore from './store/admin/management/blogEditorStore'
import './app.styl'
import Admin from './views/admin'
import { serverHost, serverPort } from '../projectConfig'

configure({ enforceActions: true })

const stores = {
  appStore,
  labelStore,
  blogListStore,
  blogEditorStore,
}

axios.interceptors.request.use(config => {
  const c = config
  // c.withCredentials = true
  const { token } = window.sessionStorage

  if (
    token
    && token.length > 0
    && config.url.startsWith(`http://${serverHost}:${serverPort}/admin`)
  ) {
    c.headers.token = window.sessionStorage.token || ''
  }
  return c
})

axios.interceptors.response.use(
  resp => {
    const { token } = resp.data
    if (token) {
      window.sessionStorage.token = resp.data.token
    }
    return resp.data
  },
  error => {
    if (error.response.status === 403) {
      window.location.href = '/admin/login'
    } else {
      Promise.reject(error)
    }
  },
)

const render = Component => {
  ReactDom.render(
    <Provider {...stores}>
      <BrowserRouter basename="">
        <Switch>
          <Route path="/admin" key="/admin" component={Admin} />
          <Route key="/home" component={Component} />
        </Switch>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root'),
  )
}

render(App)

// Remove Webpack Hot Module Replacement API
// if (module.hot) {
//   module.hot.accept('./views/App.jsx', () => {
//     render(App)
//   })
// }
