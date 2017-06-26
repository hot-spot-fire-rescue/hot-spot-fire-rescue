'use strict'
import React from 'react'
import {connect} from 'react-redux'

import {setupBoard} from './utils/setup'

class Gameboard extends React.Component {
  componentWillMount() {
    this.props.fireRef.once('value', (snapshot) => {
      if (!snapshot.exists()) this.props.fetchInitialData()
    })
  }

  render() {
    const {cells, boundaries, fetchInitialData} = this.props

    const alertWall = (event, coord) => {
      event.stopPropagation()
      alert(`this is a boundary with coordinates ${coord}`)
    }

    const alertCell = (event, num) => {
      event.stopPropagation()
      alert(`this is cell #${num}`)
    }

    return (
      <div>
        {
          cells.map(cell => {
            const eastBoundaryCoord = `[${cell.number}, ${cell.number + 1}]`
            const southBoundaryCoord = `[${cell.number}, ${cell.number + 10}]`
            const eastBoundary = boundaries.get(eastBoundaryCoord)
            const southBoundary = boundaries.get(southBoundaryCoord)
            return (
              <div key={cell.number}
              className="cell"
              id={cell.number}
              onClick={(evt) => alertCell(evt, cell.number)}>
                {
                  eastBoundary && eastBoundary.kind === 'wall'
                  ? <div className='vertical-wall'
                    id={eastBoundaryCoord}
                    onClick={(evt) => alertWall(evt, eastBoundaryCoord)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'wall'
                  ? <div className='horizontal-wall'
                    id={southBoundaryCoord}
                    onClick={(evt) => alertWall(evt, southBoundaryCoord)} />
                  : null
                }
                {
                  eastBoundary && eastBoundary.kind === 'door' && eastBoundary.status === 0
                  ? <div className='vertical-door-closed'
                    id={eastBoundaryCoord}
                    onClick={(evt) => alertWall(evt, eastBoundaryCoord)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'door' && southBoundary.status === 0
                  ? <div className='horizontal-door-closed'
                    id={southBoundaryCoord}
                    onClick={(evt) => alertWall(evt, southBoundaryCoord)} />
                  : null
                }
                {
                  eastBoundary && eastBoundary.kind === 'door' && eastBoundary.status === 1
                  ? <div className='vertical-door-open'
                    id={eastBoundaryCoord}
                    onClick={(evt) => alertWall(evt, eastBoundaryCoord)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'door' && southBoundary.status === 1
                  ? <div className='horizontal-door-open'
                    id={southBoundaryCoord}
                    onClick={(evt) => alertWall(evt, southBoundaryCoord)} />
                  : null
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}

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
