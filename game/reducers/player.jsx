import {List} from 'immutable'

import {DAMAGE_WALL,
        SWITCH_DOOR} from './boundary'
import {REMOVE_FIRE, REMOVE_SMOKE, FIRE_TO_SMOKE} from './danger'
import {AP_COSTS} from '../utils/constants'

// -- // -- // Actions // -- // -- //

export const CREATE_PLAYER = 'CREATE_PLAYER'
export const createPlayer = (id, ap, location, color) => ({
  type: CREATE_PLAYER,
  id,
  ap,
  location,
  color,
})

export const UPDATE_PLAYER='UPDATE_PLAYER'
export const updatePlayer= (id, uid) => ({
  type: UPDATE_PLAYER,
  id,
  uid
})

// export const RECEIVE_PLAYERS = 'RECEIVE_PLAYERS'
// export const receivePlayers = players => ({
//   type: RECEIVE_PLAYERS,
//   players
// })

export const MOVE_PLAYER = 'MOVE_PLAYER'
export const movePlayer = (id, nextCell, nextBoundary) => ({
  type: MOVE_PLAYER,
  id,
  nextCell,
  nextBoundary
})

export const END_TURN = 'END_TURN'
export const endTurn = () => ({
  type: END_TURN
})

// -- // -- // Helpers // -- // -- //

const isAdjacent = (next, current) => {
  const adjCells = [current + 1, current - 1, current - 10, current + 10]
  return adjCells.includes(next)
}

const isPassable = (boundary) => {
  if (!boundary) {
    return true
  } else if (boundary.kind === 'door') {
    return boundary.status === 1 || boundary.status === 2
  } else if (boundary.kind === 'wall') {
    return boundary.status === 2
  }
}

// TODO: Make this into a general 'find AP cost function'?
const findMoveApCost = (nextCell) => {
  const nextCellStatus = nextCell.status
  if (nextCellStatus === 0) {
    return AP_COSTS.moveToEmptyCell
  } else if (nextCellStatus === 1) {
    return AP_COSTS.moveToFireCell
  // TODO: check if carrying victim
  } else {
    console.error('Error in findApCost()')
  }
}

const hasEnoughAp = (currentPlayer, cost) => {
  return currentPlayer.ap - cost >= 0
}

const isBoundaryAdjacent = (boundaryLocation, playerLocation) => {
  return (boundaryLocation[0] === playerLocation ||
          boundaryLocation[1] === playerLocation)
}

// -- // -- // State // -- // -- //

const initial = {
  players: List(),
  currentId: 0
}

// -- // -- // Reducer // -- // -- //

const playerReducer = (state = initial, action) => {
  let currentPlayer,
    currentPlayerLocation,
    nextAp,
    apCost,
    nextPlayerId,
    errorMessage

  switch (action.type) {
  case CREATE_PLAYER:
    return {...state,
      players: state.players.push({
        ap: action.ap,
        location: action.location,
        color: action.color,
        uid: null,
        error: null
      })
    }

  case UPDATE_PLAYER:
    return {...state,
      players: state.players.set(action.id, {
        ...state.players.get(action.id),
        uid: action.uid
      })
    }

  case MOVE_PLAYER:
    const nextCell = action.nextCell
    const nextCellNum = nextCell.cellNum
    const nextBoundary = action.nextBoundary
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    apCost = findMoveApCost(nextCell)

    if (nextCellNum !== currentPlayerLocation &&
        isAdjacent(nextCellNum, currentPlayerLocation) &&
        isPassable(nextBoundary) &&
        hasEnoughAp(currentPlayer, apCost)) {
      return {...state,
        players: state.players.set(action.id, {
          ...state.players.get(action.id),
          ap: currentPlayer.ap - apCost,
          location: nextCellNum,
          error: null
        })
      }
    // TODO: return error if trying to carry victim through fire
    } else {
      if (nextCellNum === currentPlayerLocation) {
        errorMessage = `You are already at this location`
      } else if (!isAdjacent(nextCellNum, currentPlayerLocation)) {
        errorMessage = `You can only move to adjacent locations`
      } else if (!isPassable(nextBoundary) && nextBoundary.kind === 'door') {
        errorMessage = `You have to open the door first`
      } else if (!isPassable(nextBoundary) && nextBoundary.kind === 'wall') {
        errorMessage = `You can't pass through this intact wall`
      } else if (!hasEnoughAp(currentPlayer, apCost)) {
        errorMessage = `You don't have enough AP to move here`
      }
      console.error(errorMessage)
      return {...state,
        players: state.players.set(action.id, {
          ...state.players.get(action.id),
          error: errorMessage
        })
      }
    }

  case REMOVE_FIRE:
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    const nextFireBoundary = action.nextBoundary
    if (currentPlayer.ap >= AP_COSTS.removeFire &&
      (isAdjacent(action.location, currentPlayerLocation) || (action.location === currentPlayerLocation)) &&
      isPassable(nextFireBoundary) ) {
      return {...state,
        players: state.players.set(state.currentId, {
          ...state.players.get(state.currentId),
          ap: currentPlayer.ap - AP_COSTS.removeFire,
          error: null
        })
      }
    } else {
      if (currentPlayer.ap < AP_COSTS.removeFire) {
        errorMessage = `You don't have enough AP to extinguish fire`
      } else if (!isAdjacent(action.location, currentPlayerLocation) && (action.location !== currentPlayerLocation)) {
        errorMessage = `The fire is too far away`
      } else if (!isPassable(nextFireBoundary) && nextFireBoundary.kind === 'door') {
        errorMessage = `You have to open the door first`
      } else if (!isPassable(nextFireBoundary) && nextFireBoundary.kind === 'wall') {
        errorMessage = `You can't extinguish fire through this intact wall`
      }
      console.error(errorMessage)
      return {...state,
        players: state.players.set(state.currentId, {
          ...state.players.get(state.currentId),
          error: errorMessage
        })
      }
    }

  case FIRE_TO_SMOKE:
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    const nextFireToSmokeBoundary = action.nextBoundary
    if (currentPlayer.ap >= AP_COSTS.fireToSmoke &&
     (isAdjacent(action.location, currentPlayerLocation) || (action.location === currentPlayerLocation)) &&
      isPassable(nextFireToSmokeBoundary) )  {
      return {...state,
        players: state.players.set(state.currentId, {
          ...state.players.get(state.currentId),
          ap: currentPlayer.ap - AP_COSTS.fireToSmoke,
          error: null
        })
      }
    } else {
      if (currentPlayer.ap < AP_COSTS.fireToSmoke) {
        errorMessage = `You don't have enough AP to change fire to smoke`
      } else if (!isAdjacent(action.location, currentPlayerLocation) && (action.location !== currentPlayerLocation)) {
        errorMessage = `The fire is too far away`
      } else if (!isPassable(nextFireToSmokeBoundary) && nextFireToSmokeBoundary.kind === 'door') {
        errorMessage = `You have to open the door first`
      } else if (!isPassable(nextFireToSmokeBoundary) && nextFireToSmokeBoundary.kind === 'wall') {
        errorMessage = `You can't change fire to smoke through this intact wall`
      }
      console.error(errorMessage)
      return {...state,
        players: state.players.set(state.currentId, {
          ...state.players.get(state.currentId),
          error: errorMessage
        })
      }
    }

  case REMOVE_SMOKE:
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    const nextSmokeBoundary = action.nextBoundary
    if (currentPlayer.ap >= AP_COSTS.removeSmoke &&
      (isAdjacent(action.location, currentPlayerLocation) || (action.location === currentPlayerLocation)) &&
      isPassable(nextSmokeBoundary) ) {
      return {...state,
        players: state.players.set(state.currentId, {
          ...state.players.get(state.currentId),
          ap: currentPlayer.ap - AP_COSTS.removeSmoke,
          error: null
        })
      }
    } else {
      if (currentPlayer.ap < AP_COSTS.removeSmoke) {
        errorMessage = `You don't have enough AP to extinguish smoke`
      } else if (!isAdjacent(action.location, currentPlayerLocation) && (action.location !== currentPlayerLocation)) {
        errorMessage = `The smoke is too far away`
      } else if (!isPassable(nextSmokeBoundary) && nextSmokeBoundary.kind === 'door') {
        errorMessage = `You have to open the door first`
      } else if (!isPassable(nextSmokeBoundary) && nextSmokeBoundary.kind === 'wall') {
        errorMessage = `You can't extinguish smoke through this intact wall`
      }
      console.error(errorMessage)
      return {...state,
        players: state.players.set(state.currentId, {
          ...state.players.get(state.currentId),
          error: errorMessage
        })
      }
    }

  case DAMAGE_WALL:
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    if (currentPlayer.ap >= AP_COSTS.damageWall &&
        isBoundaryAdjacent(action.boundary.coord, currentPlayerLocation) &&
        action.boundary.status !== 2) {
      return {...state,
        players: state.players.set(state.currentId, {
          ...state.players.get(state.currentId),
          ap: currentPlayer.ap - AP_COSTS.damageWall,
          error: null
        })
      }
    } else {
      if (action.boundary.status === AP_COSTS.damageWall) {
        errorMessage = `The wall is already destroyed`
      } else if (!isBoundaryAdjacent(action.boundary.coord, currentPlayerLocation)) {
        errorMessage = `You can only damage adjacent walls`
      } else if (currentPlayer.ap < AP_COSTS.damageWall) {
        errorMessage = `You don't have enough AP to damage this wall`
      }
      console.error(errorMessage)
      return {...state,
        players: state.players.set(state.currentId, {
          ...state.players.get(state.currentId),
          error: errorMessage
        })
      }
    }

  case SWITCH_DOOR:
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    if (currentPlayer.ap >= AP_COSTS.closeOrOpenDoor &&
        isBoundaryAdjacent(action.coord, currentPlayerLocation)) {
      return {...state,
        players: state.players.set(state.currentId, {
          ...state.players.get(state.currentId),
          ap: currentPlayer.ap - AP_COSTS.closeOrOpenDoor,
          error: null
        })
      }
    } else {
      if (!isBoundaryAdjacent(action.coord, currentPlayerLocation)) {
        errorMessage = `You can only open or close adjacent doors`
      } else if (currentPlayer.ap < AP_COSTS.closeOrOpenDoor) {
        errorMessage = `You don't have enough AP to open or close this door`
      }
      console.error(errorMessage)
      return {...state,
        players: state.players.set(state.currentId, {
          ...state.players.get(state.currentId),
          error: errorMessage
        })
      }
    }

  case END_TURN:
    currentPlayer = state.players.get(state.currentId)
    nextPlayerId = (state.currentId === state.players.count() - 1) ? 0 : state.currentId + 1
    // This insures you can't store more than 4 AP for next turn
    nextAp = (currentPlayer.ap + 4 > 8) ? 8 : currentPlayer.ap + 4
    return {...state,
      players: state.players.set(state.currentId, {
        ...state.players.get(state.currentId),
        ap: nextAp,
        error: null
      }),
      currentId: nextPlayerId
    }
  }

  return state
}

export default playerReducer
