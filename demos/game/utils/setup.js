import {createCell, createBoundary} from '../reducers/board'

`
Legend for Cells:
----------------------
0 = empty, 1 = smoke, 2 = fire

Legend for Boundaries:
----------------------
door: 0 = closed, 1 = open, 2 = destroyed
wall: 0 = intact, 1 = 1 damage, 2 = 2 damage (destroyed)
`

// export const defaultBoard = [
//   {}
// ]

export const setupBoard = () => dispatch => {
  // check if no board exists
  for (let idx = 0; idx < 18; idx++) {
    dispatch(createCell(idx))
  }
  dispatch(createBoundary('[0, 10]', 'wall', 'horizontal'))
  dispatch(createBoundary('[1, 11]', 'wall', 'horizontal'))
  dispatch(createBoundary('[1, 2]', 'wall', 'vertical'))
}
