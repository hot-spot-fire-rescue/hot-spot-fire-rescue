import {List} from 'immutable'

import {DAMAGE_WALL,
        SWITCH_DOOR} from './boundary'

// -- // -- // Actions // -- // -- //

export const CREATE_PLAYER = 'CREATE_PLAYER'
export const createPlayer = (id, ap, location, color) => ({
  type: CREATE_PLAYER,
  id,
  ap,
  location,
  color
})

export const RECEIVE_PLAYERS = 'RECEIVE_PLAYERS'
export const receivePlayers = players => ({
  type: RECEIVE_PLAYERS,
  players
})

export const UPDATE_CURRENT_PLAYER = 'UPDATE_CURRENT_PLAYER'
export const updateCurrentPlayer = player => ({
  type: UPDATE_CURRENT_PLAYER,
  player
})

export const MOVE_PLAYER = 'MOVE_PLAYER'
export const movePlayer = (id, nextCell, nextBoundary) => ({
  type: MOVE_PLAYER,
  id,
  nextCell,
  nextBoundary
})

// export const SET_NEXT_PLAYER = 'SET_NEXT_PLAYER'
// export const setNextPlayer = (id) => ({
//   type: SET_NEXT_PLAYER,
//   id
// })

export const SET_AP = 'SET_AP'
export const setAp = (id, points) => ({
  type: SET_AP,
  id,
  points
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

// TODO: Make this into a general 'find AP cost function'
const findMoveApCost = (nextCell) => {
  const nextCellStatus = nextCell.status
  if (nextCellStatus === 0) {
    return 1
  // TODO: check if carrying victim
  } else if (nextCellStatus === 1) {
    return 2
  } else {
    console.log('Error in findApCost')
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
    nextPlayerId

  switch (action.type) {
  case UPDATE_CURRENT_PLAYER:
    return {...state,
      currentId: action.player
    }

  case CREATE_PLAYER:
    return {...state,
      players: state.players.push({
        ap: action.ap,
        location: action.location,
        color: action.color,
        error: null
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
          ap: currentPlayer.ap - apCost,
          location: nextCellNum,
          color: currentPlayer.color,
          error: null
        })
      }
    } else {
      // Send this error to the error message component
      console.error('This is not a legal move')
      return {...state,
        players: state.players.set(action.id, {
          ap: currentPlayer.ap,
          location: currentPlayer.location,
          color: currentPlayer.color,
          error: 'This is not a legal move'
        })
      }
    }

  case DAMAGE_WALL:
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    if (currentPlayer.ap < 2) {
      console.error(`You don't have enough AP`)
      return {...state,
        players: state.players.set(state.currentId, {
          ap: currentPlayer.ap,
          location: currentPlayer.location,
          color: currentPlayer.color,
          error: `You don't have enough AP`
        })
      }
    } else if (!isBoundaryAdjacent(action.coord, currentPlayerLocation)) {
      console.error(`The wall is too far`)
      return {...state,
        players: state.players.set(state.currentId, {
          ap: currentPlayer.ap,
          location: currentPlayer.location,
          color: currentPlayer.color,
          error: 'The wall is too far'
        })
      }
    } else {
      return {...state,
        players: state.players.set(state.currentId, {
          ap: currentPlayer.ap - 2, // TODO: Import from another file?
          location: currentPlayer.location,
          color: currentPlayer.color,
          error: null
        })
      }
    }

  case SWITCH_DOOR:
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    if (currentPlayer.ap < 1) {
      console.error(`You don't have enough AP`)
      return {...state,
        players: state.players.set(state.currentId, {
          ap: currentPlayer.ap,
          location: currentPlayer.location,
          color: currentPlayer.color,
          error: `You don't have enough AP`
        })
      }
    } else if (!isBoundaryAdjacent(action.coord, currentPlayerLocation)) {
      console.error(`The door is too far`)
      return {...state,
        players: state.players.set(state.currentId, {
          ap: currentPlayer.ap,
          location: currentPlayer.location,
          color: currentPlayer.color,
          error: 'The door is too far'
        })
      }
    } else {
      return {...state,
        players: state.players.set(state.currentId, {
          ap: currentPlayer.ap - 1, // TODO: Import from another file?
          location: currentPlayer.location,
          color: currentPlayer.color,
          error: null
        })
      }
    }

  case SET_AP:
    currentPlayer = state.players.get(state.currentId)
    currentPlayerLocation = currentPlayer.location
    nextAp = (action.points > 8) ? 8 : action.points
    return {...state,
      players: state.players.set(action.id, {
        ap: nextAp,
        location: currentPlayer.location,
        color: currentPlayer.color,
        error: null
      })
    }

  case END_TURN:
    currentPlayer = state.players.get(state.currentId)
    nextPlayerId = (state.currentId === state.players.count() - 1) ? 0 : state.currentId + 1
    nextAp = (currentPlayer.ap + 4 > 8) ? 8 : currentPlayer.ap + 4
    return {...state,
      players: state.players.set(state.currentId, {
        ap: nextAp,
        location: currentPlayer.location,
        color: currentPlayer.color,
        error: null
      }),
      currentId: nextPlayerId
    }
  }

  return state
}

export default playerReducer
