import {List, fromJS} from 'immutable'
import {END_TURN, isPassable} from './player'

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


// -- // -- // State // -- // -- //

const initial = List()


// -- // -- // Helper // -- // -- //
const sortCoord = (location, adjLocation) => {
  const [location, adjLocation] = coord
  return location < adjLocation ? ([location, adjLocation]).toString() : ([adjLocation, location]).toString()
}

// const isInsideBuilding = (location) => {
//   if (location % 10 === 0 || location % 10 === 9 || location >= 70|| location <= 10) {
//     return false
//   }
//   return true
// }



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

    const hasBoundary = (location, adjLocation, boundaries) => {
      const boundaryFound = boundaries[sortCoord(location, sortedLocation)]
      if (boundaryFound === undefined){
        return false
      } else if (boundaryFound[kind] === 'door' && boundaryFound[status] !== 0) {
        return 'opened door'
      } else if (boundaryFound[kind] === 'door' && boundaryFound[status] === 0 ) {
        return 'intact door'
      } else if (boundaryFound[kind] === 'wall' && boundaryFound[status] === 0 ) {
        return 'intact wall'
      } else if (boundaryFound[kind] === 'wall' && boundaryFound[status] === 1 ) {
        return 'damaged wall'
      } else if (boundaryFound[kind] === 'wall' && boundaryFound[status] === 2 ) {
        return 'destroyed wall'
      }


      if (checkCellDangerStatus(action.location) === 'smoke') {
        return state.set(action.location, fromJS({
          location: action.location,
          kind: 'fire',
          status: 1
        })
      } else if (checkCellDangerStatus(action.location) === 'fire') {
      /////// check North first

      // if no door/ door opened/ door destroyed && north cell is empty, add fire to adj cell
      if (checkCellDangerStatus(action.location - 10) === undefined && hasBoundary() === undefined) {
        return state.set(action.location, fromJS({
          location: action.location - 10,
          kind: 'fire',
          status: 1
        }))
      } else if (checkCellDangerStatus(action.location - 10) === undefined && hasBoundary(action.location, action.location - 10, action.boundary) === 'opened door') {
        return state.set(action.location, fromJS({
          location: action.location - 10,
          kind: 'fire',
          status: 1
        })
      }

      // if door is closed, destroy the door
      } else if ( ) {

      // check if north is a intact wall, damage it, if it's already damanaged , it will be destroyed
      } else if ( ) {

      //
      } else if ( ) {

      // if north is fire, check the next cell next to north ( while loop ), if goes outside of the building , then stops the loop

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
