import {List, fromJS} from 'immutable'

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
export const fireToSmoke = (location) => ({
  type: FIRE_TO_SMOKE,
  location,
  kind: 'smoke',
  status: 1
})

export const SMOKE_TO_FIRE = 'SMOKE_TO_FIRE'
export const smokeToFire = (location) => ({
  type: SMOKE_TO_FIRE,
  location,
  kind: 'fire',
  status: 1
})

export const REMOVE_FIRE = 'REMOVE_FIRE'
export const removeFire = (location) => ({
  type: REMOVE_FIRE,
  location,
  kind: 'fire',
  status: 0
})

export const REMOVE_SMOKE = 'REMOVE_SMOKE'
export const removeSmoke = (location) => ({
  type: REMOVE_SMOKE,
  location,
  kind: 'smoke',
  status: 0
})

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
  }

  return state
}

export default dangerReducer
