'use strict'
import React from 'react'
import {Route, IndexRedirect, IndexRoute, Link} from 'react-router'

const Lobby = () => <div>
  <h1>Lobby</h1>

  <h2><Link to='/game/test'>Start Game</Link></h2>
  <p>
    Our preliminary board for Hot Spot
  </p>
</div>

export default Lobby
