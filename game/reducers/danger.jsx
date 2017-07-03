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

export const REMOVE_DANGER = 'REMOVE_DANGER'
export const removeDanger = (location) => ({
  type: REMOVE_DANGER,
  location
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

export const FLASH_OVER = 'FLASH_OVER'
export const flashOver = (boundaries) => ({
  type: FLASH_OVER,
  boundaries
})


// -- // -- // State // -- // -- //

const initial = List()


// -- // -- // Helper // -- // -- //
const sortCoord = (location, adjLocation) => {
  return location < adjLocation ? ([location, adjLocation]).toString() : ([adjLocation, location]).toString()
}

const CheckcellDangerStatus = (danger, location) => {
  const targetCellKind = danger.getIn([location, 'kind'])
  const targetCellStatus = danger.getIn([location, 'status'])
  console.log('targetCellKind', targetCellKind)
  console.log('targetCellStatus', targetCellStatus)
  if (targetCellKind === 'fire' && targetCellStatus === 1) {
    return 'fire'
  } else if (targetCellKind === 'smoke' && targetCellStatus === 1) {
    return 'smoke'
  }
  return undefined
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

const hasAdjacentFire = (danger, location, boundaries) => {
  if (openBoundary(location, location + 10, boundaries) && checkCellDangerStatus(danger, location + 10) === 'fire') {
    return true
  } else if (openBoundary(location, location - 10, boundaries) && checkCellDangerStatus(danger, location - 10) === 'fire') {
    return true
  } else if (openBoundary(location, location + 1, boundaries) && checkCellDangerStatus(danger, location + 1) === 'fire') {
    return true
  } else if (openBoundary(location, location - 1, boundaries) && checkCellDangerStatus(danger, location + 1) === 'fire') {
    return true
  } else {
    return false
  }
}

const checkCellDangerStatus = (danger, location) => {
  const targetCellKind = danger.getIn([location, 'kind'])
  const targetCellStatus = danger.getIn([location, 'status'])
  if (targetCellKind === 'smoke' && targetCellStatus === 1) {
    return 'smoke'
  } else if (targetCellKind === 'fire' && targetCellStatus === 1) {
    return 'fire'
  }
  return undefined
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


const findSmoke = (danger) => {
  const dangerList = danger.toObject()
  const cellsToCheck = Object.values(dangerList).filter((val) => {
    return val !== undefined
  })
  const allSmoke = []
  cellsToCheck.forEach((cell) => {
    if ((cell.get('kind') === 'smoke') && (cell.get('status') === 1)) {
      allSmoke.push(cell.get('location'))
    }
  })
  return allSmoke
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

  case REMOVE_DANGER:
    if (state.getIn([action.location, 'status']) === 1) {
      return state.setIn([action.location, 'status'], 0)
    } else {
      return state
    }

  case END_TURN:
    if (checkCellDangerStatus(state, action.location) !== 'fire') {
      if (checkCellDangerStatus(state, action.location) === 'smoke') {
        return state.set(action.location, fromJS({
          location: action.location,
          kind: 'fire',
          status: 1
        }))
      } else if (checkCellDangerStatus(state, action.location) === undefined && hasAdjacentFire(state, action.location, action.boundaries) === true) {
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
    } else {
      break
    }

  case FLASH_OVER:
    let updatedState
    let allSmoke = findSmoke(state)

    while (true) {
      const fireToAddEachTerm = []
      console.log('allsmoke', allSmoke)
      for (var t = 0; t < allSmoke.length; t++) {
        console.log('hasAdjacentFire', allSmoke[t], hasAdjacentFire(state, allSmoke[t], action.boundaries))
        if (hasAdjacentFire(state, allSmoke[t], action.boundaries) === true) {
          console.log('has adjacent fire')
          fireToAddEachTerm.push(allSmoke[t])
        }
      }
      for (var k = 0; k < fireToAddEachTerm.length; k++) {
        console.log('falsh over', fireToAddEachTerm[k])
        const updatedState = state.set(fireToAddEachTerm[k], fromJS({
          location: fireToAddEachTerm[k],
          kind: 'fire',
          status: 1
        }))
        state = updatedState
      }
      allSmoke = findSmoke(state)
      if (fireToAddEachTerm.length === 0 || allSmoke.lenght === 0) {
        break
      }
    }
    return state

  case EXPLODE:
    const adjacentCells = [action.location - 10, action.location + 10, action.location + 1, action.location - 1]

    const toSetFire = []
    for (var i = 0; i < adjacentCells.length; i++) {
      console.log('explodebOUNARIES', action.boundaries)
      const isBoundaryOpen = openBoundary(action.location, adjacentCells[i], action.boundaries)

      // no adjacent boundary and empty adjacent space - add a fire to adj
      if (isBoundaryOpen && checkCellDangerStatus(state, adjacentCells[i]) === undefined) {
        toSetFire.push(adjacentCells[i])
      } else if (isBoundaryOpen && checkCellDangerStatus(state, adjacentCells[i])==='fire') {
        const locAdjust = nextAdj(i)
        let currentLoc = adjacentCells[i]
        let adjToCheckSpread = currentLoc + locAdjust

        while (openBoundary(currentLoc, adjToCheckSpread, action.boundaries) && (checkCellDangerStatus(state, adjToCheckSpread) ==='fire')) {
          currentLoc = adjToCheckSpread
          adjToCheckSpread = adjToCheckSpread + locAdjust
        }
        if (openBoundary(currentLoc, adjToCheckSpread, action.boundaries)) {
          toSetFire.push(adjToCheckSpread)
        }
      }
    }

    let newState
    for (var j = 0; j < toSetFire.length; j++) {
      const fireLoc = Number(toSetFire[j])
      newState = state.set(fireLoc, fromJS({
        location: fireLoc,
        kind: 'fire',
        status: 1
      }))
      state = newState
    }
    return newState === undefined ? state : newState
  }
  return state
}

export default dangerReducer
