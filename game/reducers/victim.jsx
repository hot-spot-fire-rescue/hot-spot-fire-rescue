import {List} from 'immutable'

import {MOVE_PLAYER,
        PICK_UP_OR_DROP_VICTIM} from './player'
import {VICTIM_LEGEND} from '../utils/constants'

`
Legend for Victim status:
----------------------
0 = unidentified (shows up on board as '?')
1 = revealed
2 = saved
3 = lost

Legend for Victim ID:
----------------------
0 = man1
1 = man2
2 = man3
3 = man4
4 = woman1
5 = woman2
6 = woman3
7 = woman4
8 = dog
9 = cat
10 = false alarm
`

// -- // -- // Actions // -- // -- //

export const CREATE_POI = 'CREATE_POI'
export const createPoi = (id, location) => ({
  type: CREATE_POI,
  id,
  location
})

// -- // -- // Helpers // -- // -- //

const isOutsideWalls = (location) => {
  return location < 10 || location > 69 || location % 10 === 0 ||
         (location + '').slice(-1) === '9'
}

// -- // -- // State // -- // -- //

const initial = List()

// -- // -- // Reducer // -- // -- //

const victimReducer = (state = initial, action) => {
  let nextCellPoi,
    isPlayerMovingIntoFalseAlarm,
    poiIndex,
    currentVictim

  switch (action.type) {
  case CREATE_POI:
    return state.push({
      location: action.location,
      status: 0,
      type: VICTIM_LEGEND[action.id],
      carriedBy: null
    })

  case MOVE_PLAYER:
    nextCellPoi = state.find(poi => (
      poi.location === action.nextCell.cellNum
    ))
    isPlayerMovingIntoFalseAlarm = nextCellPoi
      ? nextCellPoi.type === 'falseAlarm'
      : false
    poiIndex = state.findIndex(poi => (
      poi.location === action.nextCell.cellNum
    ))

    if (isPlayerMovingIntoFalseAlarm) {
      console.info(`You did not find any victims at this POI`) // TODO: move into message box since this is logged even when player throws an error
      state = state.delete(poiIndex)
    } else if (nextCellPoi && nextCellPoi.status === 0) {
      console.info(`You found a victim!`)
      state = state.set(poiIndex, {
        ...nextCellPoi,
        status: 1
      })
    }

    if (true) {
      break
    } else {
      break
    }

  case PICK_UP_OR_DROP_VICTIM:
    currentVictim = action.victim
    poiIndex = state.findIndex(poi => (
      poi.location === currentVictim.location
    ))
    if (!currentVictim.carriedBy) {
      return state.set(poiIndex, {
        ...currentVictim,
        carriedBy: action.playerId
      })
    } else {
      // saved if dropped outside walls
      if (isOutsideWalls(currentVictim.location)) {
        console.info(`You saved a victim!`)
        return state.set(poiIndex, {
          ...currentVictim,
          status: 2,
          carriedBy: null
        })
      } else {
        return state.set(poiIndex, {
          ...currentVictim,
          carriedBy: null
        })
      }
    }
  }

  return state
}

export default victimReducer
