import {List} from 'immutable'

import {
  MOVE_PLAYER,
  PICK_UP_OR_DROP_VICTIM,
  CHECK_FOR_FIRE_DAMAGE} from './player'
import {VICTIM_LEGEND} from '../utils/constants'

`
Legend for Victim status:
----------------------
-1 = not on board yet
0 = unidentified (shows up on board as '?')
1 = revealed
2 = saved
3 = lost

Legend for Victim ID:
----------------------
0 = man1
1 = man2
2 = man3
3 = woman1
4 = woman2
5 = woman3
6 = child1
7 = child2
8 = dog
9 = cat
10-14 = false alarms
`

// -- // -- // Actions // -- // -- //

export const CREATE_POI = 'CREATE_POI'
export const createPoi = (id, status, location) => ({
  type: CREATE_POI,
  id,
  status,
  location
})

export const ADD_NEXT_POI = 'ADD_NEXT_POI'
export const addNextPoi = (location) => ({
  type: ADD_NEXT_POI,
  location
})

// -- // -- // Helpers // -- // -- //

const isOutsideWalls = (location) => {
  return location < 10 || location > 69 || location % 10 === 0 ||
         location % 10 === 9
}

// -- // -- // State // -- // -- //

const initial = {
  poi: List(),
  nextPoiId: 3 // since first 3 POIs are created during setup
}

// -- // -- // Reducer // -- // -- //

const victimReducer = (state = initial, action) => {
  let nextPoiToAdd,
    nextCellPoi,
    isPlayerMovingIntoFalseAlarm,
    victimIndex,
    nextPoiIndex,
    nextLocation,
    currentVictim,
    currentlyCarriedVictim,
    currentlyCarriedVictimIdx

  switch (action.type) {
  case CREATE_POI:
    return {...state,
      poi: state.poi.push({
        location: action.location,
        status: action.status,
        type: VICTIM_LEGEND[action.id],
        carriedBy: null
      })
    }

  case ADD_NEXT_POI:
    nextPoiToAdd = state.poi.get(state.nextPoiId)
    return {
      poi: state.poi.set(state.nextPoiId, {
        ...nextPoiToAdd,
        location: action.location,
        status: 0
      }),
      nextPoiId: state.nextPoiId + 1
    }

  case MOVE_PLAYER:
    nextLocation = action.nextCell.cellNum
    nextCellPoi = state.poi.find(poi => (
      poi.location === nextLocation
    ))
    nextPoiIndex = state.poi.findIndex(poi => (
      poi.location === nextLocation
    ))
    isPlayerMovingIntoFalseAlarm = nextCellPoi
      ? nextCellPoi.type === 'falseAlarm'
      : false

    if (isPlayerMovingIntoFalseAlarm) {
      console.info(`You did not find any victims at this POI`) // TODO: move into message box since this is logged even when player throws an error
      state = {...state,
        poi: state.poi.delete(nextPoiIndex)
      }
    } else if (nextCellPoi && nextCellPoi.status === 0) {
      console.info(`You found a victim!`)
      state = {...state,
        poi: state.poi.set(nextPoiIndex, {
          ...nextCellPoi,
          status: 1
        })
      }
    }

    currentlyCarriedVictim = state.poi.find(victim => (
      victim.carriedBy === action.id
    ))
    // if there is a victim carried by current player, move victim along too
    if (currentlyCarriedVictim) {
      currentlyCarriedVictimIdx = state.poi.findIndex(victim => (
        victim.carriedBy === action.id
      ))
      if (isOutsideWalls(nextLocation)) {
        console.info(`You saved a victim!`)
        return {...state,
          poi: state.poi.set(currentlyCarriedVictimIdx, {
            ...currentlyCarriedVictim,
            status: 2,
            carriedBy: null
          })
        }
      } else {
        return {...state,
          poi: state.poi.set(currentlyCarriedVictimIdx, {
            ...currentlyCarriedVictim,
            location: nextLocation
          })
        }
      }
    } else {
      return state
    }

  case PICK_UP_OR_DROP_VICTIM:
    currentVictim = action.victim
    victimIndex = state.poi.findIndex(poi => (
      poi.location === currentVictim.location
    ))
    // pick up victim
    if (!currentVictim.carriedBy) {
      return {...state,
        poi: state.poi.set(victimIndex, {
          ...currentVictim,
          carriedBy: action.playerId
        })
      }
    // drop victim
    } else {
      return {...state,
        poi: state.poi.set(victimIndex, {
          ...currentVictim,
          carriedBy: null
        })
      }
    }

  case CHECK_FOR_FIRE_DAMAGE:
    state.poi.forEach((poi, idx) => {
      if (action.fireLocations[poi.location]) {
        if (poi.type !== 'falseAlarm') {
          console.info(`A victim was lost due to the explosion`)
          state = {...state,
            poi: state.poi.set(idx, {
              ...state.poi.get(idx),
              status: 3,
              carriedBy: null
            })
          }
        } else {
          console.info(`A POI was revealed to be a false alarm by the explosion`)
          state = {...state,
            poi: state.poi.set(idx, {
              ...state.poi.get(idx),
              status: -1
            })
          }
        }
      }
    })
    return state
  }

  return state
}

export default victimReducer
