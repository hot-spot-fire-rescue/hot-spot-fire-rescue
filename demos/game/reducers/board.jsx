import {combineReducers} from 'redux'
import {OrderedMap} from 'immutable'

`
Legend for Cells:
----------------------
0 = empty, 1 = smoke, 2 = fire

Legend for Boundaries:
----------------------
door: 0 = closed, 1 = open, 2 = destroyed
wall: 0 = intact, 1 = 1 damage, 2 = 2 damage (destroyed)
`

// -- // -- // Actions // -- // -- //

export const RESET_BOARD = 'RESET_BOARD'
export const resetBoard = () => ({
  type: RESET_BOARD
})

export const CREATE_CELL = 'CREATE_CELL'
export const createCell = (number) => ({
  type: CREATE_CELL,
  number,
  status: 0
})

export const CREATE_BOUNDARY = 'CREATE_BOUNDARY'
export const createBoundary = (location, kind, status) => ({
  type: CREATE_BOUNDARY,
  location,
  kind,
  status
})

export const SWITCH_DOOR = 'SWTICH_DOOR'
export const switchDoor = (coord, status) => ({
  type: SWITCH_DOOR,
  coord,
  status
})

export const SWITCH_WALL = 'SWTICH_WALL'
export const switchWall = (coord, status) => ({
  type: SWITCH_WALL,
  coord,
  status
})

// -- // -- // State // -- // -- //

const initial = {
  cells: OrderedMap(),
  boundaries: OrderedMap()

}

// -- // -- // Reducer // -- // -- //

const boardReducer = (state = initial, action) => {
  switch (action.type) {
  case RESET_BOARD:
    return initial

  case CREATE_CELL:
    return {...state,
      cells: state.cells.setIn([action.number], {
        number: action.number,
        status: action.status
      })
    }

  case CREATE_BOUNDARY:
    return {...state,
      boundaries: state.boundaries.setIn([action.location], {
        kind: action.kind,
        status: action.status
      })
    }

  case SWITCH_DOOR :
    return {...state,
      boundaries: state.boundaries.setIn([action.coord], {
        kind: 'door',
        status: action.status
      })
    }
  }

  return state
}

export default boardReducer
