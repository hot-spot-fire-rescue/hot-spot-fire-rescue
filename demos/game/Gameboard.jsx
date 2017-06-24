'use strict'
import React from 'react'
import {connect} from 'react-redux'

import {setupBoard} from './utils/setup'

export const Gameboard = ({cells, boundaries, fetchInitialData}) => {
  const alertWall = (event) => {
    event.stopPropagation()
    alert('this is the wall')
  }

  const alertCell = (event) => {
    event.stopPropagation()
    alert('this is the cell')
  }

  // do this in Router's onEnter
  if (cells.isEmpty()) {
    fetchInitialData()
  }

  return (
    <div>
      {
        cells.map(cell => {
          const eastBoundaryCoord = `[${cell.number}, ${cell.number + 1}]`
          const southBoundaryCoord = `[${cell.number}, ${cell.number + 10}]`
          console.log(boundaries.has(eastBoundaryCoord))
          return (
            <div key={cell.number} className="cell" id={cell.number} onClick={alertCell}>
              {
                boundaries.has(eastBoundaryCoord)
                ? <div className='vertical-wall'
                  id={eastBoundaryCoord}
                  onClick={alertWall} />
                : null
              }
              {
                boundaries.has(southBoundaryCoord)
                ? <div className='horizontal-wall'
                  id={southBoundaryCoord}
                  onClick={alertWall} />
                : null
              }
            </div>
          )
        })
      }
    </div>
  )
}

// TODO: for each cell in cells, show box and doors/walls if
// [cell] exists in Boundaries

// <div className="row">
  // <div className="cell" id="0" onClick={ alertCell }>
  //   <div className="horizontal-wall" id="0" onClick={ alertWall }></div>
  //   <div className="player"></div>
  // </div>
//   <div className="cell" onClick={ alertCell } id="1">
//     <div className="horizontal-wall" onClick={ alertWall }></div>
//   </div>
//   <div className="cell" onClick={ alertCell } id="2">
//     <div className="horizontal-wall" onClick={ alertWall }></div>
//     <div className="vertical-wall" onClick={ alertWall }></div>
//   </div>

//   <div className="cell" id="3"></div>
//   <div className="cell" id="4"></div>
//   <div className="cell" id="5"></div>
//   <div className="cell" id="6"></div>
//   <div className="cell" id="7"></div>
//   <div className="cell" id="8"></div>
//   <div className="cell" id="9"></div>
// </div>
// <div className="row">
//   <div className="cell" id="10"></div>
//   <div className="cell" id="11"></div>
//   <div className="cell" id="12"></div>
//   <div className="cell" id="13"></div>
//   <div className="cell" id="14"></div>
//   <div className="cell" id="15"></div>
//   <div className="cell" id="16"></div>
//   <div className="cell" id="17"></div>
//   <div className="cell" id="18"></div>
//   <div className="cell" id="19"></div>
// </div>

// -- // -- // Container // -- // -- //

const mapState = ({board}) => ({
  cells: board.cells,
  boundaries: board.boundaries
})

const mapDispatch = dispatch => ({
  fetchInitialData: () => {
    dispatch(setupBoard())
  }
})

export default connect(mapState, mapDispatch)(Gameboard)
