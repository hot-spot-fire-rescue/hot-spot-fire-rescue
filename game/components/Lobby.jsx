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
  }

  onLobbySubmit() {
    let currentNhere = Math.floor(Math.random() * (1000 - 6 + 1)) + 6
    this.setState({currentN: currentNhere})
    this.setState({gamesArray: this.state.gamesArray.concat(currentNhere)})
    this.setState({didUserAddNewLobby: true})
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
              (this.state.didUserAddNewLobby===true)?
                <p>Have you and your friends paste this link to your URL bar: hotspot-boardgame.com/game/{this.state.currentN} </p>: this.state.gamesArray.map((game) => (<h2><Link key={game} className='lobby-link' to={`/game/${game}`}>GAME  LOBBY: {game}</Link></h2>))

            }
            <button className='add-lobby' type="button" onClick={this.onLobbySubmit}>
              <img src="/images/avatars/YellowPuppy.png" style={{width: '70px', height: '70px'}}/> Add Lobby</button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({games}) => ({
  games: games
})
const mapDispatchToProps = dispatch => ({
  createGame: (id) => {
    dispatch(createGame(id))
  },
  removeAGame: (id) => {
    dispatch(removeGame(id))
  }
})

export default Lobby
