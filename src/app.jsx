import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'mobx-react'
import { configure } from 'mobx'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import App from './views/App'
import appStore from './store/appStore'
import './app.styl'

// don't allow state modifications outside actions
configure({ enforceActions: true })

const stores = {
  appStore,
}

ReactDom.render(
  <Provider {...stores}>
    <BrowserRouter basename="">
      <Switch>
        <Route key="/home" component={App} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
)
