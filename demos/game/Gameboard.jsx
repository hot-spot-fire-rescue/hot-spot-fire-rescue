'use strict'
import React from 'react'
import {connect} from 'react-redux'

import {setupBoard} from './utils/setup'
import {setPlayer} from './reducers/player'

class Gameboard extends React.Component {
  componentWillMount() {
    this.props.fireRef.once('value', (snapshot) => {
      if (!snapshot.exists()) this.props.fetchInitialData()
    })
  }

  render() {
    const {
      players,
      currentPlayer,
      cells,
      boundaries,
      fetchInitialData,
      setPlayerLocation} = this.props

    const alertWall = (event, coord) => {
      event.stopPropagation()
      alert(`this is a boundary with coordinates ${coord}`)
    }

    const isAdjacent = (next, current) => {
      const adjCells = [current + 1, current - 1, current - 10, current + 10]
      return adjCells.includes(next)
    }

    const isPassable = (next, current) => {
      const sortedCoords = [next, current].sort()
      const boundary = boundaries.get(`[${sortedCoords[0]}, ${sortedCoords[1]}]`)
      if (!boundary) {
        return true
      } else if (boundary.kind === 'door') {
        return boundary.status === 1 || boundary.status === 2
      } else if (boundary.kind === 'wall') {
        return boundary.status === 2
      }
    }

    const alertCell = (event, cellNum) => {
      event.stopPropagation()
      // check if there is enough AP
      if (cellNum !== currentPlayer.location &&
          isAdjacent(cellNum, currentPlayer.location) &&
          isPassable(cellNum, currentPlayer.location)) {
        // updateCurrentPlayerLocation(currentPlayer.id, cellNum)
        // call 'setPlayerLocation' on "End my turn" button
        alert(`moved to cell #${cellNum}`)
      } else {
        alert('this is not a legal move :(')
      }
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
}

// -- // -- // Container // -- // -- //

const mapState = ({board, player}) => ({
  cells: board.cells,
  boundaries: board.boundaries,
  players: player.players,
  currentPlayer: player.current
})

const mapDispatch = dispatch => ({
  fetchInitialData: () => {
    dispatch(setupBoard())
  },
  setPlayerLocation: (id, location) => {
    dispatch(setPlayer(id, location))
  }
})

export default connect(mapState, mapDispatch)(Gameboard)
