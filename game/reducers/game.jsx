import {List} from 'immutable'

// -- // -- // Actions // -- // -- //

export const CREATE_GAME = 'CREATE_GAME'
export const createGame = (name) => ({
  type: CREATE_GAME,
  name,
})

export const REMOVE_GAME = 'REMOVE_GAME'
export const removeGame = (gameIndex) => ({
  type: REMOVE_GAME,
  gameIndex
})

export const UPDATE_GAME = 'UPDATE_GAME'
export const updateGame = (name) => ({
  type: UPDATE_GAME,
  name
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
        name: action.name,
        error: null
      })
    }

  case REMOVE_GAME:
    return {...state,
      games: state.games.delete(action.gameIndex)
    }
  case UPDATE_GAME:
    return {...state,
      games: state.games.set(action.name, {
        ...state.games.get(action.name)
      })
    }
  }
}

export default gameReducer
