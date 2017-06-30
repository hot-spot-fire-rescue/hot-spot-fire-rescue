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

// -- // -- // State // -- // -- //

const initial = List()

// -- // -- // Reducer // -- // -- //

const victimReducer = (state = initial, action) => {
  let nextCellPoi,
    isPlayerMovingIntoFalseAlarm,
    poiIndex

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
    if (nextCellPoi) {
      poiIndex = state.findIndex(poi => (
        poi.location === action.nextCell.cellNum
      ))
      if (isPlayerMovingIntoFalseAlarm) {
        console.info(`This was a false alarm!`) // TODO: move into message box
        return state.delete(poiIndex)
      } else {
        // not a false alarm
        console.info(`You found a victim!`)
        return state.set(poiIndex, {
          ...nextCellPoi,
          status: 1
        })
      }
    } else {
      break
    }

  // case PICK_UP_OR_DROP_VICTIM:
  // check for false alarm => remove POI
  // check if victim was picked up
  // check if victim was dropped => remove POI if dropped outside walls
  //   return
  }

  return state
}

export default victimReducer
