'use strict'
import React from 'react'
import {Router, Route, Link, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'

import firebase from 'APP/fire'

import Game from 'APP/game'
import injectTapEventPlugin from 'react-tap-event-plugin'
import NavbarComp from 'APP/game/components/Navbar'

injectTapEventPlugin()

const auth = firebase.auth()
auth.onAuthStateChanged(user => user || auth.signInAnonymously())

const App = ({children}) => (
  <MuiThemeProvider>
    <div>
      {/*<nav>
        <WhoAmI auth={auth}/>
      </nav>*/}
      <NavbarComp auth={auth}/>
      {children}
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
