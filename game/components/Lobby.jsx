'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

let n = 5
let added = false
const gamesArray = [1, 2, 3, 4, 5]
const Lobby = (props) => {
  return (
    <div className='lobby-background'>
      <div className = 'onfire-image'></div>
      <div className= 'game-name'></div>
      <div className='lobby-list-box'>
        <p className='choose-lobby text-center'>
          CHOOSE A LOBBY
      </p>
        <div className ='lobby-list text-center'>
          {
            gamesArray.map((game) => (<h2><Link className='lobby-link' to={`/game/${game}`}>GAME  LOBBY :  {game}</Link></h2>))
          }
        </div>
        <button className='add-lobby' type="button" class="btn btn-warning text-center" onClick={(event) => {
          event.preventDefault()
          n = n + 1
          gamesArray.push(n)
          return gamesArray
        }}> Add Lobby</button>
        {/*console.log(gamesArray)*/}
      </div>
    </div>
  )
}

const mapState = ({ games }) => ({
  games: games
})

const mapDispatch = dispatch => ({
  createAGame: (id) => {
    dispatch(createGame(id))
  },
  removeAGame: (id) => {
    dispatch(removeGame(id))
  }
})

export default Lobby
