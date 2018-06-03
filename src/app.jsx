import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'mobx-react'
import { configure } from 'mobx'
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
    <App />
  </Provider>,
  document.getElementById('root'),
)
