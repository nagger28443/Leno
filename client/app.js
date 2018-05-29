// import React from 'react'
// import ReactDOM from 'react-dom'
// import { BrowserRouter } from 'react-router-dom'
// import { Provider } from 'mobx-react'
// import { ThemeProvider, JssProvider } from 'react-jss'

// import App from './views/App.js'
// import appStore from './store/appStore.js'
// import { projectName } from '../projectConfig.js'

import React from 'react';
import ReactDom from 'react-dom';
import appStore from 'client/store/appStore';
import moduleName from './app.styl';
import passage from './passage';


if (module.hot) {
  module.hot.accept();
}

const arr = passage.split('\n')

ReactDom.render(
  <div>{arr.map(ele => `${ele}haha`)}</div>, document.getElementById('root'));



// const theme = {}

// const render = Component => {
//   ReactDOM.render(
//     <div/>,
//     // <Provider {...appStore}>
//     //   <BrowserRouter>
//     //     <ThemeProvider theme={theme}>
//     //       <JssProvider>
//     //         <Component />
//     //       </JssProvider>
//     //     </ThemeProvider>
//     //   </BrowserRouter>
//     // </Provider>,
//     document.getElementById('root')
//   )
// }

// render(App)

// // Remove Webpack Hot Module Replacement API
// if (module.hot) {
//   module.hot.accept('./views/App.js', () => {
//     render(App)
//   })
// }
