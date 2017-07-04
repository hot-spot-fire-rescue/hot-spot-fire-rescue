'use strict'
import React from 'react'
import {Route, IndexRedirect, IndexRoute, Link} from 'react-router'
import {PanelGroup, Panel} from 'react-bootstrap'

import Signup from 'APP/app/components/Signup'
import Lobby from './components/Lobby'
import RulePage from './components/Rulepage'
import GamePageWrapper from './GamePageWrapper'

// TODO: Show sign in component if not signed in, else show list of lobbies
const HomePage = ({children}) => <div className = 'homepage-background'>
  <h2 id = 'golobby'><Link to='/lobby/test'>GO TO LOBBY</Link></h2>
  <h2 id = 'gorule'><Link to='/rules'>GAME RULES</Link></h2>
  <Panel header="Sign up" ><Signup /></Panel>
</div>

export default <Route path="/home" component={({children}) => children}>
  <IndexRoute component={HomePage} />
  <Route path='/lobby/:id' component={Lobby}/>
  <Route path='/rules' component={RulePage}/>
  <Route path='/game/:id' component={GamePageWrapper}/>
</Route>
