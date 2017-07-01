import { List, fromJS } from 'immutable'
import { END_TURN, isPassable } from './player'

`
Legend for Danger:
fire: 0 = removed, 1 = exist
smoke: 0 = removed, 1 = exist
`

// -- // -- // Actions // -- // -- //

export const CREATE_DANGER = 'CREATE_DANGER'
export const createDanger = (location, kind, status) => {
  return ({
    type: CREATE_DANGER,
    location,
    kind,
    status
  })
}

export const FIRE_TO_SMOKE = 'FIRE_TO_SMOKE'
export const fireToSmoke = (location, nextBoundary) => ({
  type: FIRE_TO_SMOKE,
  location,
  kind: 'smoke',
  status: 1,
  nextBoundary
})

export const SMOKE_TO_FIRE = 'SMOKE_TO_FIRE'
export const smokeToFire = (location, nextBoundary) => ({
  type: SMOKE_TO_FIRE,
  location,
  kind: 'fire',
  status: 1,
  nextBoundary
})

export const REMOVE_FIRE = 'REMOVE_FIRE'
export const removeFire = (location, nextBoundary) => ({
  type: REMOVE_FIRE,
  location,
  kind: 'fire',
  status: 0,
  nextBoundary
})

export const REMOVE_SMOKE = 'REMOVE_SMOKE'
export const removeSmoke = (location, nextBoundary) => ({
  type: REMOVE_SMOKE,
  location,
  kind: 'smoke',
  status: 0,
  nextBoundary
})

export const endTurn = (location, boundaries) => ({
  type: END_TURN,
  location,
  boundaries
})

export const EXPLODE = 'EXPLODE'
export const explode = (actionCellDangerStatus, location, boundaries) => ({
  type: EXPLODE,
  actionCellDangerStatus,
  location,
  boundaries
})


// -- // -- // State // -- // -- //

const initial = List()


// -- // -- // Helper // -- // -- //
const sortCoord = (location, adjLocation) => {
  return location < adjLocation ? ([location, adjLocation]).toString() : ([adjLocation, location]).toString()
}

//  helper function - to check the type of boundary
export const openBoundary = (location, adjLocation, boundaries) => {
  const boundaryFound = boundaries[sortCoord(location, adjLocation)]
  if (boundaryFound === undefined) {
    return true
  } else if (boundaryFound['kind'] === 'door' && boundaryFound['status'] === 0) {
    return false
  } else if (boundaryFound['kind'] === 'door' && boundaryFound['status'] === 1) {
    return true
  } else if (boundaryFound['kind'] === 'door' && boundaryFound['status'] === 2) {
    return true
  } else if (boundaryFound['kind'] === 'wall' && boundaryFound['status'] === 0) {
    return false
  } else if (boundaryFound['kind'] === 'wall' && boundaryFound['status'] === 1) {
    return false
  } else if (boundaryFound['kind'] === 'wall' && boundaryFound['status'] === 2) {
    return true
  }
}

// helper function used to calculate the next adjacent cell
const nextAdj = (i, currentLoc) => {
  if (i === 0) {
    return () => currentLoc - 10
  } else if (i === 1) {
    return () => currentLoc + 10
  } else if (i === 2) {
    return () => currentLoc + 1
  } else if (i === 3) {
    return () => currentLoc - 1
  }
}

// -- // -- // Reducer // -- // -- //

const dangerReducer = (state = initial, action) => {
  switch (action.type) {
  case CREATE_DANGER:
    return state.set(action.location, fromJS({
      location: action.location,
      kind: action.kind,
      status: action.status
    }))

  case FIRE_TO_SMOKE:
    return state.setIn([action.location, 'kind'], action.kind)

  case SMOKE_TO_FIRE:
    return state.setIn([action.location, 'kind'], action.kind)

  case REMOVE_FIRE:
    return state.setIn([action.location, 'status'], action.status)

  case REMOVE_SMOKE:
    return state.setIn([action.location, 'status'], action.status)

  case END_TURN:
    const checkCellDangerStatus = (location) => {
      const targetCellKind = state.getIn([location, 'kind'])
      const targetCellStatus = state.getIn([location, 'status'])
      if (targetCellKind === 'smoke' && targetCellStatus === 1) {
        return 'smoke'
      } else if (targetCellKind === 'fire' && targetCellStatus === 1) {
        return 'fire'
      }
      return undefined
    }
    if (checkCellDangerStatus(action.location) === 'smoke') {
      return state.set(action.location, fromJS({
        location: action.location,
        kind: 'fire',
        status: 1
      }))
    } else {
      return state.set(action.location, fromJS({
        location: action.location,
        kind: 'smoke',
        status: 1
      }))
    }

  case EXPLODE:
    console.log('explosion cause more dangers')
    const adjacentCells = [action.location - 10, action.location + 10, action.location + 1, action.location - 1]

    for (var i = 0; i < adjacentCells.length; i++) {
      const adjBoundary = openBoundary(action.location, adjacentCells[i], action.boundaries)
      const adjCellKind = state.getIn([adjacentCells[i], 'kind'])
      const adjCellStatus = state.getIn([adjacentCells[i], 'status'])

      // no adjacent boundary and empty adjacent space - add a fire to adj
      if (adjBoundary === true && adjCellKind === undefined) {
        console.log('explosion happened, fire caused in the empty space', adjacentCells[i])
        return state.set(adjacentCells[i], fromJS({
          location: adjacentCells[i],
          kind: 'fire',
          status: 1
        }))

      // has smoke in adjacent cell, turn the smoke into fire
      } else if (adjBoundary === true && adjCellKind === 'smoke' && adjCellStatus === 1) {
        console.log('explosion happened, turned smoke into fire', adjacentCells[i])
        return state.set(adjacentCells[i], fromJS({
          location: adjacentCells[i],
          kind: 'fire',
          status: 1
        }))

      // fire pass through fire space, and spread into one more empty space
      } else if (adjBoundary === true && adjCellKind === 'fire' && adjCellStatus === 1) {

        let currentLoc = adjacentCells[i]
        let adjToCheckSpread = nextAdj(i, currentLoc)
        while (openBoundary(currentLoc, adjToCheckSpread, action.boundaries) === true && state.getIn([adjToCheckSpread, 'kind']) === 'fire' && state.getIn([adjToCheckSpread, 'status'] === 1)) {
          currentLoc = adjToCheckSpread
          adjToCheckSpread = adjToCheckSpread - 10
        }
        console.log('explosion happened, fire is spreading')
        return state.set(adjToCheckSpread, fromJS({
          location: adjacentCells[i],
          kind: 'fire',
          status: 1
        }))
      }
    }
  }

  return state
}

export default dangerReducer
