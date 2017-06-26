'use strict'
import React from 'react'
import {Route, IndexRedirect, IndexRoute, Link} from 'react-router'

import Game from './game'

const Index = ({children}) => <div>
  <h1>Home Page</h1>

  <h2><Link to='demos/game/test'>Board</Link></h2>
  <p>
    Our preliminary board for Hot Spot
  </p>
</div>

export default <Route path="/demos" component={({children}) => children}>
  <IndexRoute component={Index}/>
  <Route path='game/:id' component={Game}/>
</Route>
