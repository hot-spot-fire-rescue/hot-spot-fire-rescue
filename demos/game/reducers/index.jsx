import {combineReducers} from 'redux'

const rootReducer = combineReducers({
  board: require('./board').default,
  player: require('./player').default,
  danger: require('./danger').default
})

export default rootReducer
