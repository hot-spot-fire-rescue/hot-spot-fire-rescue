import {List} from 'immutable'

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

export const SET_NEXT_PLAYER = 'SET_NEXT_PLAYER'
export const setNextPlayer = (id) => ({
  type: SET_NEXT_PLAYER,
  id
})

export const SET_AP = 'SET_AP'
export const setAp = (id, points) => ({
  type: SET_AP,
  id,
  points
})

// -- // -- // State // -- // -- //

const initial = {
  players: List(),
  currentId: 0
}

// -- // -- // Helpers // -- // -- //

const isAdjacent = (next, current) => {
  const adjCells = [current + 1, current - 1, current - 10, current + 10]
  return adjCells.includes(next)
}

const isPassable = (boundary) => {
  // const sortedCoords = next < current ? [next, current] : [current, next]
  // const boundaryCoords = `[${sortedCoords[0]}, ${sortedCoords[1]}]`
  // const boundary = boundaries.get(boundaryCoords)
  if (!boundary) {
    return true
  } else if (boundary.kind === 'door') {
    return boundary.status === 1 || boundary.status === 2
  } else if (boundary.kind === 'wall') {
    return boundary.status === 2
  }
}

const findApCost = (nextCell) => {
  console.log('nextCell', nextCell)
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

// -- // -- // Reducer // -- // -- //

const playerReducer = (state = initial, action) => {
  switch (action.type) {
  // case RECEIVE_PLAYERS:
  //   return {...state,
  //     players: action.players
  //   }

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
    const currentPlayer = state.players.get(state.currentId)
    const currentPlayerLocation = currentPlayer.location
    const apCost = findApCost(nextCell)

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
      // setPlayerLocation(currentPlayerId, cellNum)
      // return {...state,
      //   players: state.players.map(player => {
      //     if (player.id === action.id) {
      //       player.location = action.location
      //     }
      //     return player
      //   })
      // }
      // updateAp(currentPlayerId, currentPlayer.ap - apCost)
    } else {
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

  case SET_AP:
    return {...state,
      players: state.players.set(action.id, {
        ap: action.points,
        location: currentPlayer.location,
        color: currentPlayer.color,
        error: null
      })
    }

  case SET_NEXT_PLAYER:
    return {...state,
      currentId: action.id}
  }

  return state
}

export default playerReducer
