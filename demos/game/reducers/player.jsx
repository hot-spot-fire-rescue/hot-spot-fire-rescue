import {combineReducers} from 'redux'
import {OrderedMap} from 'immutable'

// -- // -- // Actions // -- // -- //

export const CREATE_PLAYER = 'CREATE_PLAYER'
export const createPlayer = (id, ap, location, color) => ({
  type: CREATE_PLAYER,
  id,
  ap,
  location,
  color
})

export const RECEIVE_PLAYERS = 'RECEIVE_PLAYERS'
export const receivePlayers = players => ({
  type: RECEIVE_PLAYERS,
  players
})

export const UPDATE_CURRENT_PLAYER = 'UPDATE_CURRENT_PLAYER'
export const updateCurrentPlayer = player => ({
  type: UPDATE_CURRENT_PLAYER,
  player
})

export const SET_PLAYER = 'SET_PLAYER'
export const setPlayer = (id, location) => ({
  type: SET_PLAYER,
  id,
  location
})

export const SET_NEXT_PLAYER = 'SET_NEXT_PLAYER'
export const setNextPlayer = (id) => ({
  type: SET_NEXT_PLAYER,
  id
})

export const SUBTRACT_AP = 'SUBTRACT_AP'
export const subtractAp = (id, points) => ({
  type: SUBTRACT_AP,
  id,
  points
})

// -- // -- // State // -- // -- //

const initial = {
  players: [],
  currentId: 0
}

// -- // -- // Reducer // -- // -- //

const playerReducer = (state = initial, action) => {
  switch (action.type) {
  case RECEIVE_PLAYERS:
    return {...state,
      players: action.players
    }

  case UPDATE_CURRENT_PLAYER:
    return {...state,
      currentId: action.player
    }

  case CREATE_PLAYER:
    return {...state,
      players: state.players.concat([{
        id: action.id,
        ap: action.ap,
        location: action.location,
        color: action.color}])
    }

  case SET_PLAYER:
    return {...state,
      players: state.players.map(player => {
        if (player.id === action.id) {
          player.location = action.location
        }
        return player
      })
    }

  case SUBTRACT_AP:
    return {...state,
      players: state.players.map(player => {
        if (player.id === action.id) {
          player.ap -= action.points
        }
        return player
      })
    }

  case SET_NEXT_PLAYER:
    return {...state,
      currentId: action.id}
  }

  return state
}

export default playerReducer
