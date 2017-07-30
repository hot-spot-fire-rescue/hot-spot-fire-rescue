import React from 'react'
import {Route} from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()

import LobbyPage from './components/LobbyPage'

export default () =>
    <div className='lobbyPage'>
      <LobbyPage fireRef={db.ref('lobbies')}/>
  </div>
