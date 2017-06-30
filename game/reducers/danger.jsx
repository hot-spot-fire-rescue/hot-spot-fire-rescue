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

export const endTurn = (location) => ({
  type: END_TURN,
  location,
  kind: 'smoke',
  status: 1
})

// -- // -- // Helper // -- // -- //


// export const addRandomSmoke = () => {

//   return (dispatch) => {
//     console.log('hello')
//     const isValid = (num) => {
//       if (num % 10 === 0 || num % 10 === 9 || num >= 70) {
//         return false
//       }
//       return true
//     }

//     let locationToAddSmoke = 0
//     while (!isValid(locationToAddSmoke)) {
//       locationToAddSmoke = Math.floor(Math.random() * 48) + 1
//     }

//     console.log('locationToAddSmoke', locationToAddSmoke)

//     dispatch(createDanger(locationToAddSmoke, 'smoke', 1))
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
    return state.set(action.location, fromJS({
      location: action.location,
      kind: 'smoke',
      status: 1
    }))
  }

  return state
}

export default dangerReducer
