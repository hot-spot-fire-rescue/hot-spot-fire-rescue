import {Map} from 'immutable'

`
Legend for Boundaries:
----------------------
door: 0 = closed, 1 = open, 2 = destroyed
wall: 0 = intact, 1 = 1 damage, 2 = 2 damage (destroyed)
`

// -- // -- // Actions // -- // -- //

export const CREATE_BOUNDARY = 'CREATE_BOUNDARY'
export const createBoundary = (coord, kind, status) => ({
  type: CREATE_BOUNDARY,
  coord,
  kind,
  status
})

export const SWITCH_DOOR = 'SWTICH_DOOR'
export const switchDoor = (coord, status) => ({
  type: SWITCH_DOOR,
  coord,
  status
})

export const DAMAGE_WALL = 'DAMAGE_WALL'
export const damageWall = (coord, status) => ({
  type: DAMAGE_WALL,
  coord,
  status
})

// -- // -- //  State  // -- // -- //

const initial = Map()

// -- // -- // Helpers // -- // -- //

export const sortCoord = (coord) => {
  const [first, second] = coord
  return first > second ? [second, first] : [first, second]
}

// -- // -- // Reducer // -- // -- //

const boundaryReducer = (state = initial, action) => {
  switch (action.type) {
  case CREATE_BOUNDARY:
    let sortedCoord = sortCoord(action.coord)
    return state.set(sortedCoord.toString(), {
      kind: action.kind,
      status: action.status,
      coord: sortedCoord
    })

  case SWITCH_DOOR :
    return state.set(action.coord, {
      kind: 'door',
      status: action.status
    })

  case DAMAGE_WALL :
    return state.set(action.coord, {
      kind: 'wall',
      status: action.status
    })
  }

  return state
}

export default boundaryReducer
