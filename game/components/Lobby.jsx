'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

let n = 5
let added = false
const gamesArray = [1, 2, 3, 4, 5]
const Lobby = (props) => {
  return (
    <div className='lobby-background'>
      <div className='onfire-image'></div>
      <div className='game-name'></div>
      <div className='lobby-list-box'>
        <p className='choose-lobby text-center'>
          CHOOSE A LOBBY
        </p>
        <div className ='lobby-list text-center'>
          {
            gamesArray.map((game) => (<h2><Link key={game} className='lobby-link' to={`/game/${game}`}>GAME  LOBBY: {game}</Link></h2>))
          }
          <button className='add-lobby' type="button" onClick={(event) => {
            event.preventDefault()
            n = n + 1
            gamesArray.push(n)
            return gamesArray
          }}><img src="/images/avatars/YellowPuppy.png" style={{width: '70px', height: '70px'}}/> Add Lobby</button>
        </div>
      </div>
    </div>
  )
}

const mapState = ({ games }) => ({
  games: games
})

// TODO
const mapDispatch = dispatch => ({
  createAGame: (id) => {
    dispatch(createGame(id))
  },
  removeAGame: (id) => {
    dispatch(removeGame(id))
  }
})

export default Lobby
