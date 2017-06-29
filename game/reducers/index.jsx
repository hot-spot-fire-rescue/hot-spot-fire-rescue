import {combineReducers} from 'redux'
import playerReducer from './player'
import boardReducer from './board'
import boundaryReducer from './boundary'
import dangerReducer from './danger'

// This is a custom combineReducers function that first passes
// the action to the players reducer only. Then it passes actions to the board
// and boundary reducers only if the current player does not have an error.
export default function(state = {}, action) {
  const nextPlayerState = playerReducer(state.player, action)
  const nextBoardState = boardReducer(state.board, action)
  const nextBoundaryState = boundaryReducer(state.boundary, action)
  const nextDangerState = dangerReducer(state.danger, action)

  if (!nextPlayerState.players.get(nextPlayerState.currentId, {}).error) {
    return {
      player: nextPlayerState,
      board: nextBoardState,
      boundary: nextBoundaryState,
      danger: nextDangerState
    }
  } else {
    return {
      player: nextPlayerState,
      board: state.board,
      boundary: state.boundary,
      danger: state.danger
    }
  }
}

