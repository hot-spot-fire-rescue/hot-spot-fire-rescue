import React from 'react'
import {Route} from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()

import GamePage from './components/GamePage'

export default ({params: {id}}) =>
    <div className='gamePage'>
      <h1>ID: {id}</h1>
      <GamePage fireRef={db.ref('board').child(id)} gameId={id}/>
  </div>
