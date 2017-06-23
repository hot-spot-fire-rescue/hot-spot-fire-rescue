'use strict'
import React from 'react'
import {Route, IndexRedirect, IndexRoute, Link} from 'react-router'

import Scratchpad from './scratchpad'
import Whiteboard from './whiteboard'
import Chat from './chat'
import Board from './board'

const Index = ({children}) => <div>
  <h1>Demos!</h1>
  <h2><Link to='demos/scratchpad/welcome'>Scratchpad</Link></h2>
  <p>
    The scratchpad is the very simplest React/Firebase demo—a text area
    whose content is synced with Firebase.
  </p>

  <h2><Link to='demos/chat/welcome'>Chat</Link></h2>
  <p>
    A chat room — the canonical Firebase example.
  </p>

  <h2><Link to='demos/whiteboard/welcome'>Whiteboard</Link></h2>
  <p>
    The whiteboard demonstrates the <i>journal</i> pattern, a way to use Firebase
    to synchronize the state of Redux stores on all collaborators machines.
  </p>

  <h2><Link to='demos/board/test'>Board</Link></h2>
  <p>
    Our preliminary board for Hot Spot
  </p>
</div>

export default <Route path="/demos" component={({children}) => children}>
  <IndexRoute component={Index}/>
  <Route path='scratchpad/:title' component={Scratchpad}/>
  <Route path='whiteboard/:title' component={Whiteboard}/>
  <Route path='chat/:room' component={Chat}/>
  <Route path='board/:id' component={Board}/>
</Route>
