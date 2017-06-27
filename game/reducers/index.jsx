import {combineReducers} from 'redux'

const rootReducer = combineReducers({
  board: require('./board').default,
  boundary: require('./boundary').default,
  player: require('./player').default
})

export default rootReducer
