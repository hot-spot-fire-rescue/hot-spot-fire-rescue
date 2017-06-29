import {combineReducers} from 'redux'
import playerReducer from './player'
import boardReducer from './board'
import boundaryReducer from './boundary'
import dangerReducer from './danger'
import victimReducer from './victim'

/* You can refactor to this:
  const reducer = combineReducers({
    player: require('player').default,
    board,
    boundary,
    danger,
    victim,
  })
*/

// This is a custom combineReducers function that first passes
// the action to the players reducer only. Then it passes actions to the board
// and boundary reducers only if the current player does not have an error.
export default function(state = {}, action) {
  const nextPlayerState = playerReducer(state.player, action)
  const nextBoardState = boardReducer(state.board, action)
  const nextBoundaryState = boundaryReducer(state.boundary, action)
  const nextDangerState = dangerReducer(state.danger, action)
  const nextVictimState = victimReducer(state.victim, action) /* You can replace all the above with:
   const next = reducer(state, action)
  */



  if (!nextPlayerState.players.get(nextPlayerState.currentId, {}).error) {
    /* Replace the return below with:
    return next
    */
    return {
      player: nextPlayerState,
      board: nextBoardState,
      boundary: nextBoundaryState,
      danger: nextDangerState,
      victim: nextVictimState
    }
  } else {
    return {
      /* Replace all the below with:
      ...next,
      player: next.player
      */
      player: nextPlayerState,
      board: state.board,
      boundary: state.boundary,
      danger: state.danger,
      victim: state.victim
    }
  }
}
