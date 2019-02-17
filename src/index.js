import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Landing from './pages/landing/Landing';
import Home from './pages/home/Home';
import Privacy from './pages/privacy/Privacy'
import * as serviceWorker from './serviceWorker'

import { BrowserRouter as Router, Route } from 'react-router-dom'

const routing = (
    <Router>
      <div>
        <Route exact path="/" component={Landing} />
        <Route path="/home" component={Home} />
        <Route path="/privacy" component={Privacy} />
      </div>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
