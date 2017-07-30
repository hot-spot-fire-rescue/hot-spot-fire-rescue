'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'
import {createGame, removeGame} from '../reducers/game'
import { connect, Provider } from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import reducer from '../reducers'
let n = 5
let added = false
class Lobby extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
      currentN: 6,
      gamesArray: [1, 2, 3, 4, 5],
      didUserAddNewLobby: false
    }

    this.onLobbySubmit=this.onLobbySubmit.bind(this)
    this.removeGameCallback= this.removeGameCallback.bind(this)
  }

  onLobbySubmit() {
    this.props.createAGame(this.state.gamesArray.length + this.props.games.size+1)
  }

  removeGameCallback(event) {
    const removeAGame = this.props.removeAGame
    event.stopPropagation()
    removeAGame(event.target.id)
  }

  render() {
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
               this.state.gamesArray.map((game) => (<h2><Link key={game} className='lobby-link' to={`/game/${game}`}>GAME  LOBBY: {game}</Link></h2>))
            }
            {
               (this.props.games.size>0)?
               this.props.games.map((game) => {
                 let idx= this.props.games.indexOf(game)
                 return (
                 <div key={idx}><h2><Link className='lobby-link' to={`/game/${game.id}`}>GAME  LOBBY: {game.id}</Link></h2>
                   {/* <button className="btn btn-default" name="delete" id={idx} onClick={this.removeGameCallback}>X</button> */}
                 </div>)
               })

                 :<div></div>

            }
            <button className='add-lobby' type="button" onClick={this.onLobbySubmit}>
              <img src="/images/avatars/YellowPuppy.png" style={{width: '70px', height: '70px'}}/> Add Lobby</button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({game}) => ({
  games: game.games
})
const mapDispatchToProps = dispatch => ({
  createAGame: (id) => {
    dispatch(createGame(id))
  },
  removeAGame: (id) => {
    dispatch(removeGame(id))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Lobby)
