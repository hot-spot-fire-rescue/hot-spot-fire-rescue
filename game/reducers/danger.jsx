import {List, fromJS} from 'immutable'
import {END_TURN} from './player'

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
    status})
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

// -- // -- // Helper // -- // -- //
const sortCoord = (coord) => {
  const [first, second] = coord
  return first > second ? [second, first] : [first, second]
}

// const isInsideBuilding = (location) => {
//   if (location % 10 === 0 || location % 10 === 9 || location >= 70|| location <= 10) {
//     return false
//   }
//   return true
// }

const checkStatus = (location) => {
  const targetCellKind = this.state.danger.getIn([location, 'kind'])

  const targetCellStatus = this.state.danger.getIn([location, 'status'])
  if (targetCellKind === 'smoke' && targetCellStatus === 1) {
    return 'smoke'
  } else if (targetCellKind === 'fire' && targetCellStatus === 1) {
    return 'fire'
  }
}


// const getNewStatus = (location, boundaries) => {
//   const adjCells =[]
//   const adjToCheck = [location -1, location + 1, location - 10, location + 10]
//   for (var i = 0; i < adjToCheck.length; i++) {
//     var sortedCoord = sortCoord(adjToCheck[i], location)
//     if (isInsideBuilding(adjToCheck[i]) && boundaries.get(sortedCoord.toString()) !== undefined && checkStatus(adjToCheck[i]) === 'smoke') {
//       return 'fire'
//     }
//   }
// }



// -- // -- // State // -- // -- //

const initial = List()

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
    const targetCellKind = state.getIn([action.location, 'kind'])
    const targetCellStatus = state.getIn([action.location, 'status'])

    if (targetCellKind === 'smoke' && targetCellStatus === 1) {
      return state.set(action.location, fromJS({
        location: action.location,
        kind: 'fire',
        status: 1
      }))
    } else if (targetCellKind === 'fire' && targetCellStatus === 1) {

      //check if north is a intact wall, damage it, if it's already damanaged , it will be destroyed
      //if north is empty cell , just add fire to the cell
      //if north is closed door, just destory the door
      //if north is fire, check the next cell next to north ( while loop ), if goes outside of the building , then stops the loop

    } else {
      return state.set(action.location, fromJS({
        location: action.location,
        kind: 'smoke',
        status: 1
      }))
    }
  }

  return state
}

export default dangerReducer
