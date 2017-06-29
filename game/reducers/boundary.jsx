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
export const switchDoor = (coord) => ({
  type: SWITCH_DOOR,
  coord
})

export const DAMAGE_WALL = 'DAMAGE_WALL'
export const damageWall = (boundary) => ({
  type: DAMAGE_WALL,
  boundary
})

// -- // -- // Helpers // -- // -- //

export const sortCoord = (coord) => {
  const [first, second] = coord
  return first > second ? [second, first] : [first, second]
}

// -- // -- //  State  // -- // -- //

const initial = Map()

// -- // -- // Reducer // -- // -- //

const boundaryReducer = (state = initial, action) => {
  let sortedCoord, currentStatus, newStatus
  switch (action.type) {
  case CREATE_BOUNDARY:
    sortedCoord = sortCoord(action.coord)
    return state.set(sortedCoord.toString(), {
      kind: action.kind,
      status: action.status,
      coord: sortedCoord
    })

  case SWITCH_DOOR:
    sortedCoord = sortCoord(action.coord)
    currentStatus = state.get(sortedCoord.toString()).status
    newStatus = (currentStatus === 0) ? 1 : 0
    return state.set(sortedCoord.toString(), {
      ...state.get(sortedCoord.toString()),
      status: newStatus
    })

  case DAMAGE_WALL:
    sortedCoord = sortCoord(action.boundary.coord)
    currentStatus = state.get(sortedCoord.toString()).status
    if (currentStatus === 0) {
      newStatus = 1
    } else if (currentStatus === 1) {
      newStatus = 2
    }
    return state.set(sortedCoord.toString(), {
      ...state.get(sortedCoord.toString()),
      status: newStatus
    })
  }

  return state
}

export default boundaryReducer
