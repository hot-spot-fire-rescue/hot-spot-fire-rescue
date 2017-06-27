'use strict'
import React from 'react'
import {Route, IndexRedirect, IndexRoute, Link} from 'react-router'

import Lobby from './components/Lobby'
import GamePageWrapper from './GamePageWrapper'

// TODO: Show sign in component if not signed in, else show list of lobbies
const HomePage = ({children}) => <div>
  <h1>Home Page</h1>
  <h2><Link to='/lobby/test'>Go to Test Lobby</Link></h2>
</div>

export default <Route path="/home" component={({children}) => children}>
  <IndexRoute component={HomePage}/>
  <Route path='/lobby/:id' component={Lobby}/>
  <Route path='/game/:id' component={GamePageWrapper}/>
</Route>
