import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'mobx-react'
import { configure } from 'mobx'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import 'babel-polyfill'
import axios from 'axios'
import appStore from './store/appStore'
import labelStore from './store/banner/labelStore'
import blogListStore from './store/blogList/blogListStore'
import blogEditorStore from './store/admin/management/blogEditorStore'
import './app.styl'
import { serverHost, serverPort } from '../projectConfig'
import ErrorHandler from './errorHandler'
import Admin from './views/admin'
import App from './views/App'

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
      return {
        code: error.response.status,
        message: error.message,
      }
    }
    return null
  },
)


ReactDom.render(
  <ErrorHandler>
    <Provider {...stores}>
      <BrowserRouter basename="">
        <Switch>
          <Route path="/admin" key="/admin" component={Admin} />
          <Route key="/home" component={App} />
        </Switch>
      </BrowserRouter>
    </Provider>
  </ErrorHandler>,

  document.getElementById('root'),
)


// Remove Webpack Hot Module Replacement API
// if (module.hot) {
//   module.hot.accept('./views/App.jsx', () => {
//     render(App)
//   })
// }
