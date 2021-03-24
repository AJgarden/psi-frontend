import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import LayoutPage from './view/LayoutPage'

import 'antd/dist/antd.css'
import './style/index.sass'
import './style/sider.sass'

ReactDOM.render(
  <Router>
    <Route path='/:type?/:page?/:id?' component={LayoutPage} />
  </Router>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
