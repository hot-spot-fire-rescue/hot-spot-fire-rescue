import { Map } from 'immutable'

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

export const EXPLODE_BOUNDARIES = 'EXPLODE_BOUNDARIES'
export const explodeBoundaries = (actionCellDangerStatus, location, danger) => ({
  type: EXPLODE_BOUNDARIES,
  actionCellDangerStatus,
  location,
  danger
})

// -- // -- // Helpers // -- // -- //

export const sortCoord = (coord) => {
  const first = coord[0]
  const second = coord[1]
  return first > second ? [second, first] : [first, second]
}

// helper function used to calculate the next adjacent cell
const nextAdj = (i) => {
  if (i === 0) {
    return -10
  } else if (i === 1) {
    return 10
  } else if (i === 2) {
    return 1
  } else if (i === 3) {
    return -1
  }
}

//  helper function - to check the type of boundary
export const boundaryType = (location, adjLocation, boundaries) => {
  let boundaryKind
  let boundaryStatus
  const boundrayFound = boundaries.get(sortCoord([location, adjLocation]).toString())
  if (boundrayFound !== undefined) {
    boundaryKind = boundrayFound.kind
    boundaryStatus = boundrayFound.status
  } else {
    return undefined
  }

  if (boundaryKind === 'door' && boundaryStatus === 0) {
    return 'closed door'
  } else if (boundaryKind === 'door' && boundaryStatus === 1) {
    return 'opened door'
  } else if (boundaryKind === 'door' && boundaryStatus === 2) {
    return 'destroyed door'
  } else if (boundaryKind === 'wall' && boundaryStatus === 0) {
    return 'intact wall'
  } else if (boundaryKind === 'wall' && boundaryStatus === 1) {
    return 'damaged wall'
  } else if (boundaryKind === 'wall' && boundaryStatus === 2) {
    return 'destroyed wall'
  }
}

const CheckcellDangerStatus = (danger, location) => {
  let dangerKind
  let dangerStatus
  for (var i = 0; i < danger.length; i++) {
    if (danger[i]['location'] === location) {
      dangerKind = danger[i]['kind']
      dangerStatus = danger[i]['status']
    }
    if (dangerKind === 'fire' && dangerStatus === 1) {
      return 'fire'
    } else if (dangerStatus === 'smoke' && dangerStatus === 1) {
      return 'smoke'
    }
  }
}

// helper function to destroy door

const destroyDoor = (current, next, doorToDestroy) => {
  const coord = [current, next]
  const sortedCoord = sortCoord(coord)
  doorToDestroy.push(sortedCoord.toString())
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

  case EXPLODE_BOUNDARIES:
    console.log('check if boundary is exploded at Cell:', action.location)
    const doorToDestroy = []
    const wallToDamage = []
    const wallToDestroy = []

    for (var i = 0; i < 4; i++) {
      let current = action.location
      let adjust = nextAdj(i)
      let next = current + adjust
      let currentCellDangerStatus = CheckcellDangerStatus(action.danger, current)
      let nextCellDangerStatus = CheckcellDangerStatus(action.danger, next)
      let adjBoundary = boundaryType(current, next, state)
      while (true) {
        if (Math.floor(current/10)!== Math.floor(next/10) && current%10 !== next%10) {
          break
        }

        // Always break the opened door
        if (adjBoundary === 'opened door') {
          sortedCoord = sortCoord([current, next])
          doorToDestroy.push(sortedCoord)
          break
        }

        // Handle the obstacles that finishes the loop.
        if (adjBoundary === 'closed door') {
          sortedCoord = sortCoord([current, next])
          doorToDestroy.push(sortedCoord)
          break
        }
        if (adjBoundary === 'intact wall') {
          sortedCoord = sortCoord([current, next])
          wallToDamage.push(sortedCoord)
          break
        }
        if (adjBoundary === 'damaged wall') {
          sortedCoord = sortCoord([current, next])
          wallToDestroy.push(sortedCoord)
          break
        }

        if (nextCellDangerStatus !== 'fire') {
          break
        }

        // If the loops is not broken yet.
        current = next
        next = current + adjust
        currentCellDangerStatus= CheckcellDangerStatus(action.danger, current)
        adjBoundary = boundaryType(current, next, state)
        nextCellDangerStatus = CheckcellDangerStatus(action.danger, next)
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

    for (var k = 0; k < wallToDamage.length; k++) {
      newState = state.set((wallToDamage[k]).toString(), {
        kind: 'wall',
        status: 1,
        coord: wallToDamage[k]
      })
      state = newState
    }

    for (var l = 0; l < wallToDestroy.length; l++) {
      newState = state.set((wallToDestroy[l]).toString(), {
        kind: 'wall',
        status: 2,
        coord: wallToDestroy[l]
      })
      state = newState
    }

    return newState === undefined ? state : newState
  }

  return state
}

export default boundaryReducer
