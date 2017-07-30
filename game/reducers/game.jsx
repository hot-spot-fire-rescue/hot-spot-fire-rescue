import {List} from 'immutable'

// -- // -- // Actions // -- // -- //

export const CREATE_GAME = 'CREATE_GAME'
export const createGame = (id) => ({
  type: CREATE_GAME,
  id,
})

export const REMOVE_GAME = 'REMOVE_GAME'
export const removeGame = (gameIndex) => ({
  type: REMOVE_GAME,
  gameIndex
})

export const UPDATE_GAME = 'UPDATE_GAME'
export const updateGame = (id) => ({
  type: UPDATE_GAME,
  id
})

// -- // -- // Helpers // -- // -- //

// -- // -- // State // -- // -- //

const initial = {
  games: List()
}

// -- // -- // Reducer // -- // -- //

const gameReducer = (state = initial, action) => {
  switch (action.type) {
  case CREATE_GAME:
    return {...state,
      games: state.games.push({
        id: action.id,
        error: null
      })
    }

  case REMOVE_GAME:
    return {...state,
      games: state.games.delete(action.gameIndex)
    }
  case UPDATE_GAME:
    return {...state,
      games: state.games.set(action.id, {
        ...state.games.get(action.id)
      })
    }
  }
  return state
}

export default gameReducer
