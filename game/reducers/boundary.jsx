import {Map} from 'immutable'
import {EXPLODE} from './danger'

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

export const explode = (actionCellDangerStatus, location, boundaries) => ({
  type: EXPLODE,
  actionCellDangerStatus,
  location,
  boundaries
})

// -- // -- // Helpers // -- // -- //

export const sortCoord = (coord) => {
  const first = coord[0]
  const second = coord[1]
  return first > second ? [second, first] : [first, second]
}

//  helper function - to check the type of boundary
export const boundaryType = (location, adjLocation, boundaries) => {
  const boundaryFound = boundaries[sortCoord([location, adjLocation])]
  if (boundaryFound === undefined) {
    return undefined
  } else if (boundaryFound['kind'] === 'door' && boundaryFound['status'] === 0) {
    return 'closed door'
  } else if (boundaryFound['kind'] === 'door' && boundaryFound['status'] === 1) {
    return 'opened door'
  } else if (boundaryFound['kind'] === 'door' && boundaryFound['status'] === 2) {
    return 'destroyed door'
  } else if (boundaryFound['kind'] === 'wall' && boundaryFound['status'] === 0) {
    return 'intact wall'
  } else if (boundaryFound['kind'] === 'wall' && boundaryFound['status'] === 1) {
    return 'damaged wall'
  } else if (boundaryFound['kind'] === 'wall' && boundaryFound['status'] === 2) {
    return 'destroyed wall'
  }
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

  case EXPLODE:
    console.log('check if boundary is exploded at Cell:', action.location)
    const adjacentCells = [action.location - 10, action.location + 10, action.location + 1, action.location - 1]
    const doorToDestroy = []
    const wallToDamage = []
    const wallToDestroy = []

    for (var i = 0; i < adjacentCells.length; i++) {
      const adjBoundary = boundaryType(action.location, adjacentCells[i], action.boundaries)
      const adjCellKind = state.getIn([adjacentCells[i], 'kind'])
      const adjCellStatus = state.getIn([adjacentCells[i], 'status'])

      if (action.actionCellDangerStatus ==='fire' && (adjBoundary === 'closed door' || adjBoundary === 'opened door')) {
        console.log('explosion happened, open/closed door was destroyed', adjacentCells[i])
        let coord = [action.location, adjacentCells[i]]
        sortedCoord = sortCoord(coord)
        console.log('sorted Coord', sortedCoord)
        console.log('adjacentCells[i]')
        doorToDestroy.push(sortedCoord.toString())
      } else if (action.actionCellDangerStatus ==='fire' && adjBoundary === 'intact wall') {
        console.log('explosion happened, intact wall was damaged', adjacentCells[i])
        sortedCoord = sortCoord([action.location, adjacentCells[i]])
        wallToDamage.push(sortedCoord.toString())
      } else if (action.actionCellDangerStatus ==='fire' && adjBoundary === 'damaged wall') {
        console.log('explosion happened, damaged wall was destroyed', adjacentCells[i])
        sortedCoord = sortCoord([action.location, adjacentCells[i]])
        wallToDestroy.push(sortedCoord.toString())
      }
    }
    console.log('doorToDestroy', doorToDestroy)
    console.log('wallToDamage', wallToDamage)
    console.log('wallToDestroy', wallToDestroy)

    let newState
    for (var j = 0; j < doorToDestroy.length; j++) {
      newState = state.set(sortedCoord.toString(), {
        kind: 'door',
        status: 2,
        coord: doorToDestroy[j]
      })
      state = newState
    }

    for (var k = 0; k < wallToDestroy.length; k++) {
      newState = state.set(sortedCoord.toString(), {
        kind: 'wall',
        status: 1,
        coord: wallToDamage[k]
      })
      state = newState
    }

    for (var l = 0; l < wallToDestroy.length; l++) {
      newState = state.set(sortedCoord.toString(), {
        kind: 'wall',
        status: 2,
        coord: wallToDamage[l]
      })
      state = newState
    }
    return newState === undefined ? state: newState
  }

  return state
}

export default boundaryReducer
