'use strict'
import React from 'react'
import {connect} from 'react-redux'

import {setupBoard} from './utils/setup'

export const Gameboard = ({cells, boundaries, players, fetchInitialData}) => {
  const alertWall = (event, coord) => {
    event.stopPropagation()
    alert(`this is a boundary with coordinates ${coord}`)
  }

  const alertCell = (event, num) => {
    event.stopPropagation()
    alert(`this is cell #${num}`)
  }

  // Not sure if this is the right place to fetch initial data
  if (cells.isEmpty()) {
    fetchInitialData()
  }

  return (
    <div>
      {
        cells.map(cell => {
          const eastBoundaryCoord = `[${cell.number}, ${cell.number + 1}]`
          const southBoundaryCoord = `[${cell.number}, ${cell.number + 10}]`
          const eastBoundary = boundaries.get(eastBoundaryCoord)
          const southBoundary = boundaries.get(southBoundaryCoord)
          const player = players.find(player => player.location === cell.number)
          console.log(player, "~~~~~~~~~~~~")
          return (
            <div key={cell.number}
            className="cell"
            id={cell.number}
            onClick={(evt) => alertCell(evt, cell.number)}>
              {
                player 
                ? <div className='player'
                  id={player.id} style={{backgroundColor: player.color}}/>
                : null
              }
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

// -- // -- // Container // -- // -- //

const mapState = ({board, player}) => ({
  cells: board.cells,
  boundaries: board.boundaries,
  players: player.players
})

const mapDispatch = dispatch => ({
  fetchInitialData: () => {
    dispatch(setupBoard())
  }
})

export default connect(mapState, mapDispatch)(Gameboard)
