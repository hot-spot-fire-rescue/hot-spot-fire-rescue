import {combineReducers} from 'redux'

const rootReducer = combineReducers({
  board: require('./board').default,
<<<<<<< HEAD:demos/game/reducers/index.jsx
  player: require('./player').default,
  danger: require('./danger').default
=======
  boundary: require('./boundary').default,
  player: require('./player').default
>>>>>>> 3242f02e29c57ace06576230f6dbfb4bfdb9c824:game/reducers/index.jsx
})

export default rootReducer
