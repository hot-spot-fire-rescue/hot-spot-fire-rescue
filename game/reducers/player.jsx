import {List} from 'immutable'

import {DAMAGE_WALL,
        SWITCH_DOOR} from './boundary'
import {REMOVE_FIRE, REMOVE_SMOKE, FIRE_TO_SMOKE} from './danger'
import {AP_COSTS} from '../utils/constants'
import {findClosestAmbulance} from '../utils/functions'

// -- // -- // Actions // -- // -- //

export const CREATE_PLAYER = 'CREATE_PLAYER'
export const createPlayer = (id, ap, location, color, username) => ({
  type: CREATE_PLAYER,
  id,
  ap,
  location,
  color,
  username
})

export const REMOVE_PLAYER='REMOVE_PLAYER'
export const removePlayer = (playerIndex) => ({
  type: REMOVE_PLAYER,
  playerIndex
})

export const UPDATE_PLAYER='UPDATE_PLAYER'
export const updatePlayer= (id, uid) => ({
  type: UPDATE_PLAYER,
  id,
  uid
})

export const MOVE_PLAYER = 'MOVE_PLAYER'
export const movePlayer = (id, nextCell, nextBoundary, nextDangerKind) => ({
  type: MOVE_PLAYER,
  id,
  nextCell,
  nextBoundary,
  nextDangerKind
})

export const END_TURN = 'END_TURN'
export const endTurn = (location, boundaries) => ({
  type: END_TURN,
  location,
  boundaries
})

export const PICK_UP_OR_DROP_VICTIM = 'PICK_UP_OR_DROP_VICTIM'
export const pickUpOrDropVictim = (victim, playerId) => ({
  type: PICK_UP_OR_DROP_VICTIM,
  victim,
  playerId
})

export const CHECK_FOR_FIRE_DAMAGE = 'CHECK_FOR_FIRE_DAMAGE'
export const checkForFireDamage = (fireLocations) => ({
  type: CHECK_FOR_FIRE_DAMAGE,
  fireLocations
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

const findMoveApCost = (player, nextCell, nextDanger) => {
  const nextCellStatus = nextCell.status
  if (player.carriedVictim) {
    return AP_COSTS.moveWithVictim
  } else if (nextDanger === 'fire') {
    return AP_COSTS.moveToFireCell
  } else {
    return AP_COSTS.moveToEmptyCell
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
    errorMessage,
    victim,
    closestAmbulanceLocation

  switch (action.type) {
  case CREATE_PLAYER:
    return {...state,
      players: state.players.push({
        id: action.id,
        ap: action.ap,
        location: action.location,
        color: action.color,
        username: action.username,
        carriedVictim: null,
        uid: null,
        error: null
      })
    }

  case REMOVE_PLAYER:
    return {...state,
      players: state.players.delete(action.playerIndex)
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
    const nextDangerKind = action.nextDangerKind
    const nextCellNum = nextCell.cellNum
    const nextBoundary = action.nextBoundary
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    apCost = findMoveApCost(currentPlayer, nextCell, nextDangerKind)
    const validStartingCell= nextCellNum%10===0 || (nextCellNum+1)%10===0

    if ((currentPlayer.location=== -1 && validStartingCell) || (nextCellNum !== currentPlayerLocation &&
        isAdjacent(nextCellNum, currentPlayerLocation) &&
        isPassable(nextBoundary) &&
        hasEnoughAp(currentPlayer, apCost) &&
        !(nextDangerKind === 'fire' && currentPlayer.carriedVictim))) {
      return {...state,
        players: state.players.set(action.id, {
          ...state.players.get(action.id),
          ap: currentPlayer.ap - apCost,
          location: nextCellNum,
          error: null
        })
      }
    } else {
      if (nextCellNum === currentPlayerLocation) {
        errorMessage = `You are already at this location`
      } else if (nextDangerKind === 'fire' && currentPlayer.carriedVictim) {
        errorMessage = `You can't carry victims through fire`
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
      isPassable(nextFireBoundary)) {
      return {...state,
        players: state.players.set(state.currentId, {
          ...currentPlayer,
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
          ...currentPlayer,
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
      isPassable(nextFireToSmokeBoundary)) {
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
          ...currentPlayer,
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
      isPassable(nextSmokeBoundary)) {
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
          ...currentPlayer,
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
          ...currentPlayer,
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
          ...currentPlayer,
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
          ...currentPlayer,
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
        ...currentPlayer,
        ap: nextAp,
        error: null
      }),
      currentId: nextPlayerId
    }

  case PICK_UP_OR_DROP_VICTIM:
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    victim = action.victim

    // pick up victim
    if (victim.location === currentPlayer.location &&
        victim.status === 1 &&
        !victim.carriedBy &&
        !currentPlayer.carriedVictim) {
      return {...state,
        players: state.players.set(state.currentId, {
          ...currentPlayer,
          carriedVictim: victim.type,
          error: null
        })
      }
    // drop victim
    } else if (victim.location === currentPlayer.location &&
               victim.status === 1 &&
               victim.carriedBy === state.currentId &&
               victim.type === currentPlayer.carriedVictim) {
      return {...state,
        players: state.players.set(state.currentId, {
          ...currentPlayer,
          carriedVictim: null,
          error: null
        })
      }
    } else {
      if (victim.location !== currentPlayer.location) {
        errorMessage = `You can only pick up a victim in your current cell`
      } else if (victim.carriedBy && victim.carriedBy !== state.currentId) {
        errorMessage = `This victim is already being carried by another firefighter`
      } else if (victim.type !== currentPlayer.carriedVictim) {
        errorMessage = `You can only carry one victim at a time`
      }
      console.error(errorMessage)
      return {...state,
        players: state.players.set(state.currentId, {
          ...currentPlayer,
          error: errorMessage
        })
      }
    }

  case CHECK_FOR_FIRE_DAMAGE:
    state.players.forEach((player, idx) => {
      closestAmbulanceLocation = findClosestAmbulance(player.location)
      if (action.fireLocations[player.location]) {
        console.info(`Player #${idx + 1} was knocked down by the explosion!`)
        state = {...state,
          players: state.players.set(idx, {
            ...state.players.get(idx),
            location: closestAmbulanceLocation,
            carriedVictim: null
          })
        }
      }
    })
    return state
  }

  return state
}

export default playerReducer