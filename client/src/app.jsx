import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'mobx-react'
import { configure } from 'mobx'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import axios from 'axios'
import App from './views/App'
import appStore from './store/appStore'
import labelStore from './store/banner/labelStore'
import './app.styl'
import Admin from './views/admin'

configure({ enforceActions: true })

const stores = {
  appStore,
  labelStore,
}

axios.interceptors.response.use(
  resp => resp.data,
  error => {
    Promise.reject(error)
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
