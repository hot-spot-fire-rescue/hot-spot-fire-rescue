'use strict'
import React from 'react'
import {connect} from 'react-redux'
import {switchDoor, switchWall} from './reducers/board'
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
      currentPlayerId,
      cells,
      boundaries,
      fetchInitialData,
      setPlayerLocation} = this.props

    const handleWallSwitch = (event, coord, status) => {
      event.stopPropagation()
      let newStatus = (status === 0) ? 1 : 0
      this.props.changeWallStatus(coord, newStatus)
    }

    const handleDoorSwitch = (event, coord, status) => {
      let newStatus = (status === 0) ? 1 : 0
      this.props.openCloseDoor(coord, newStatus)
    }

    const isAdjacent = (next, current) => {
      const adjCells = [current + 1, current - 1, current - 10, current + 10]
      return adjCells.includes(next)
    }

    const isPassable = (next, current) => {
      const sortedCoords = next < current ? [next, current] : [current, next]
      const boundaryCoords = `[${sortedCoords[0]}, ${sortedCoords[1]}]`
      const boundary = boundaries.get(boundaryCoords)

      if (!boundary) {
        return true
      } else if (boundary.kind === 'door') {
        return boundary.status === 1 || boundary.status === 2
      } else if (boundary.kind === 'wall') {
        return boundary.status === 2
      }
    }

    const handleCellClick = (event, cellNum) => {
      event.stopPropagation()
      // check if there is enough AP
      const currentPlayerLocation = players[currentPlayerId].location
      if (cellNum !== currentPlayerLocation &&
          isAdjacent(cellNum, currentPlayerLocation) &&
          isPassable(cellNum, currentPlayerLocation)) {
        setPlayerLocation(currentPlayerId, cellNum)
        subtractAp(currentPlayerId, cellNum)
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
              onClick={(evt) => handleCellClick(evt, cell.number)}>
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
                    onClick={(evt) => handleWallSwitch(evt, eastBoundaryCoord, eastBoundary.status)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'wall'
                  ? <div className='horizontal-wall'
                    id={southBoundaryCoord}
                    onClick={(evt) => handleWallSwitch(evt, southBoundaryCoord)} />
                  : null
                }
                {
                  eastBoundary && eastBoundary.kind === 'door' && eastBoundary.status === 0
                  ? <div className='vertical-door-closed'
                    id={eastBoundaryCoord}
                    onClick={(evt) => handleDoorSwitch(evt, eastBoundaryCoord, eastBoundary.status)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'door' && southBoundary.status === 0
                  ? <div className='horizontal-door-closed'
                    id={southBoundaryCoord}
                    onClick={(evt) => handleDoorSwitch(evt, southBoundaryCoord, eastBoundary.status)} />
                  : null
                }
                {
                  eastBoundary && eastBoundary.kind === 'door' && eastBoundary.status === 1
                  ? <div className='vertical-door-open'
                    id={eastBoundaryCoord}
                    onClick={(evt) => handleDoorSwitch(evt, eastBoundaryCoord, eastBoundary.status)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'door' && southBoundary.status === 1
                  ? <div className='horizontal-door-open'
                    id={southBoundaryCoord}
                    onClick={(evt) => handleDoorSwitch(evt, southBoundaryCoord, southBoundary.status)} />
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
  currentPlayerId: player.currentId
})

const mapDispatch = dispatch => ({
  fetchInitialData: () => {
    dispatch(setupBoard())
  },
  openCloseDoor: (coord, status) => {
    dispatch(switchDoor(coord, status))
  },
  changeWallStatus: (coord, status) => {
    dispatch(switchWall(coord, status))
  },
  setPlayerLocation: (id, location) => {
    dispatch(setPlayer(id, location))
  }
})

export default connect(mapState, mapDispatch)(Gameboard)
