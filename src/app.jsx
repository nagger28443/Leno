import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'mobx-react'
import { configure } from 'mobx'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import App from './views/App'
import appStore from './store/appStore'
import './app.styl'

configure({ enforceActions: true })

const stores = {
  appStore,
}

const render = Component => {
  ReactDom.render(
    <Provider {...stores}>
      <BrowserRouter basename="">
        <Switch>
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
