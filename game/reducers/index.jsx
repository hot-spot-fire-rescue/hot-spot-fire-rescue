import {combineReducers} from 'redux'
import playerReducer from './player'
import boardReducer from './board'
import boundaryReducer from './boundary'

// const rootReducer = combineReducers({
//   board: require('./board').default,
//   boundary: require('./boundary').default,
//   player: require('./player').default
// })

// export default rootReducer

// This is a custom combineReducers function that first passes
// the action to the players reducer and then to the board and
// boundary reducers only if the current player does not have an error.
export default function(state = {}, action) {
  const player = playerReducer(state.player, action)
  const board = boardReducer(state.board, action)
  const boundary = boundaryReducer(state.boundary, action)
  if (!player.players.get(player.currentId, {}).error) {
    return {player, board, boundary}
  } else {
    return {
      player,
      board: state.board,
      boundary: state.boundary}
  }
}
