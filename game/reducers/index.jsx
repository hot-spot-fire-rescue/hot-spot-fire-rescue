import {combineReducers} from 'redux'

const reducer = combineReducers({
  player: require('./player').default,
  board: require('./board').default,
  boundary: require('./boundary').default,
  danger: require('./danger').default,
  victim: require('./victim').default,
  message: require('./message').default,
  game: require('./game').default
})

// This is a custom combineReducers function that first passes
// the action to the players reducer only. Then it passes actions to the board
// and boundary reducers only if the current player does not have an error.
export default function(state = {}, action) {
  const next = reducer(state, action)

  if (!next.player.players.get(next.player.currentId, {}).error) {
    return next
  } else {
    return {
      ...state,
      player: next.player
    }
  }
}
