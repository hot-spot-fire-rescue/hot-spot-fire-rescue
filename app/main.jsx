'use strict'
import React from 'react'
import {Router, Route, Link, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Alert from 'react-s-alert'

import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import firebase from 'APP/fire'
import Game from 'APP/game'

injectTapEventPlugin()

const auth = firebase.auth()
auth.onAuthStateChanged(user => user || auth.signInAnonymously())

const App = ({children}) => (
  <MuiThemeProvider>
    <div>
      <nav>
        <WhoAmI auth={auth}/>
      </nav>
      {children}
      <Alert stack={{limit: 1}} position='bottom-right' effect='slide'/>
    </div>
  </MuiThemeProvider>
)

render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="home"/>
      {Game}
    </Route>
    <Route path='*' component={NotFound}/>
  </Router>,
  document.getElementById('main')
)
