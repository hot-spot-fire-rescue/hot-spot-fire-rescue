import {List} from 'immutable'

`
Legend for Cells:
----------------------
0 = empty, 1 = smoke, 2 = fire
`

// -- // -- // Actions // -- // -- //

export const CREATE_CELL = 'CREATE_CELL'
export const createCell = (cellNum) => ({
  type: CREATE_CELL,
  cellNum,
  status: 0
})

// -- // -- // State // -- // -- //

const initial = List()

// -- // -- // Reducer // -- // -- //

const boardReducer = (state = initial, action) => {
  switch (action.type) {
  case CREATE_CELL:
    return state.set(action.cellNum, {
      cellNum: action.cellNum,
      status: action.status
    })
  }

  return state
}

export default boardReducer
