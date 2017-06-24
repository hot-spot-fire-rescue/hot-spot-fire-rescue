import {combineReducers} from 'redux'

const rootReducer = combineReducers({
  board: require('./board').default
})

export default rootReducer
