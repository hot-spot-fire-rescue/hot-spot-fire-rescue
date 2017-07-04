'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

let n = 5
let added = false
const gamesArray = [1, 2, 3, 4, 5]
const Lobby = (props) => {
  return (
    <div className='lobby-background'>
      <h1>Lobby</h1>
      {/*console.log('PROPS', props)*/}
      {/*console.log(this)*/}
      {/*console.log(gamesArray)*/}
      <h2><Link to='/home'>HOME</Link></h2>
      <h2><Link to='/rules'>GAME RULE</Link></h2>
      <h2><Link to='/game/test'>START GAME</Link></h2>
      <div className = 'onfire-image'></div>
      <div className= 'game-name'></div>
      <div className='lobby-list'>
        <p className='choose-lobby'>
          CHOOSE A LOBBY
      </p>
        <div>
          {
            gamesArray.map((game) => (<h2><Link className='lobby-link' to={`/game/${game}`}>GAME LOBBY: {game}</Link></h2>))
          }
        </div>
        <button onClick={() => {
          n = n + 1
          gamesArray.push(n)
          // console.log('HIIIIII', gamesArray)
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
