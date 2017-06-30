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
  color
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

// CHECK FOR FALSE ALARMS?

export const PICK_UP_OR_DROP_VICTIM = 'PICK_UP_OR_DROP_VICTIM'
export const pickUpOrDropVictim = (victim) => ({
  type: PICK_UP_OR_DROP_VICTIM,
  victim
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

const findMoveApCost = (nextCell, player) => {
  const nextCellStatus = nextCell.status
  if (nextCellStatus === 0) {
    return AP_COSTS.moveToEmptyCell
  } else if (nextCellStatus === 1) {
    return AP_COSTS.moveToFireCell
  } else if (player.carriedVictimId) {
    return AP_COSTS.moveWithVictim
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
    errorMessage,
    victim

  switch (action.type) {
  case CREATE_PLAYER:
    return {...state,
      players: state.players.push({
        ap: action.ap,
        location: action.location,
        color: action.color,
        carriedVictim: null,
        error: null
      })
    }

  case MOVE_PLAYER:
    const nextCell = action.nextCell
    const nextCellNum = nextCell.cellNum
    const nextBoundary = action.nextBoundary
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    apCost = findMoveApCost(nextCell, currentPlayer)

    if (nextCellNum !== currentPlayerLocation &&
        isAdjacent(nextCellNum, currentPlayerLocation) &&
        // check if next cell is not on fire
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
      // } else if (nextCell.currentPlayer.carriedVictimId) {
        // check if next cell is on fire
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

  case DAMAGE_WALL:
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    if (currentPlayer.ap >= AP_COSTS.damageWall &&
        isBoundaryAdjacent(action.boundary.coord, currentPlayerLocation) &&
        action.boundary.status !== 2) {
      return {...state,
        players: state.players.set(state.currentId, {
          ...currentPlayer,
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
      } else {
        console.error('Error in playerReducer DAMAGE_WALL')
      }
      console.error(errorMessage)
      return {...state,
        players: state.players.set(state.currentId, {
          ...currentPlayer,
          error: errorMessage
        })
      }
    }

  case REMOVE_FIRE:
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    if (currentPlayer.ap >= AP_COSTS.removeFire &&
      action.location === currentPlayerLocation) {
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
      } else if (action.location !== currentPlayerLocation) {
        errorMessage = `You can only extinguish fire in your current cell`
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
    if (currentPlayer.ap >= AP_COSTS.fireToSmoke &&
      action.location === currentPlayerLocation) {
      return {...state,
        players: state.players.set(state.currentId, {
          ...currentPlayer,
          ap: currentPlayer.ap - AP_COSTS.fireToSmoke,
          error: null
        })
      }
    } else {
      if (currentPlayer.ap < AP_COSTS.fireToSmoke) {
        errorMessage = `You don't have enough AP to change fire to smoke`
      } else if (action.location !== currentPlayerLocation) {
        errorMessage = `You can only change fire to smoke in your current cell`
      } else {
        console.log('check the current ap and location', currentPlayerLocation, currentPlayer.ap, action.location)
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
    if (currentPlayer.ap >= AP_COSTS.removeSmoke &&
      action.location === currentPlayerLocation) {
      return {...state,
        players: state.players.set(state.currentId, {
          ...currentPlayer,
          ap: currentPlayer.ap - AP_COSTS.removeSmoke,
          error: null
        })
      }
    } else {
      if (currentPlayer.ap < AP_COSTS.removeSmoke) {
        errorMessage = `You don't have enough AP to extinguish smoke`
      } else if (action.location !== currentPlayerLocation) {
        errorMessage = `You can only extinguish smoke in your current cell`
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
    // check if false alarm => send message
    // check if victim is on same space as current player
    // check if victim is already revealed not to be a false alarm
    // check if victim is not being carried by anyone
    // check if current player is carrying any victims
    if (victim.type !== 'falseAlarm' &&
        victim.location === currentPlayer.location &&
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
      if (victim.type === 'falseAlarm') {
        errorMessage = `This was a false alarm!`
      } else if (victim.status === 0) {
        errorMessage = `You need to reveal this POI first`
      } else if (victim.location !== currentPlayer.location) {
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
  }

  return state
}

export default playerReducer
