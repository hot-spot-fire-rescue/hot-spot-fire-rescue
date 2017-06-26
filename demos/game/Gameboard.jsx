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

    const handleWallDamage = (event, coord, status) => {
      event.stopPropagation()
      let newStatus
      if (status === 0) {
        newStatus = 1
      } else if (status === 1) {
        console.log('heloo2')
        newStatus = 2
      }
      console.log('new WALLLL status', newStatus)
      this.props.changeWallStatus(coord, newStatus)
    }

    const handleDoorSwitch = (event, coord, status) => {
      let newStatus = (status === 0) ? 1 : 0
      this.props.openOrCloseDoor(coord, newStatus)
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

    const alertCell = (event, cellNum) => {
      event.stopPropagation()
      // check if there is enough AP
      const currentPlayerLocation = players[currentPlayerId].location
      if (cellNum !== currentPlayerLocation &&
          isAdjacent(cellNum, currentPlayerLocation) &&
          isPassable(cellNum, currentPlayerLocation)) {
        setPlayerLocation(currentPlayerId, cellNum)
        // alert(`moved to cell #${cellNum}`)
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
                  eastBoundary && eastBoundary.kind === 'wall' && eastBoundary.status === 0
                  ? <div className='vertical-wall'
                    id={eastBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, eastBoundaryCoord, eastBoundary.status)} />
                  : null
                }
                {
                  eastBoundary && eastBoundary.kind === 'wall' && eastBoundary.status === 1
                  ? <div className='vertical-wall-damagedOnce'
                    id={eastBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, eastBoundaryCoord, eastBoundary.status)} />
                  : null
                }
                {
                  eastBoundary && eastBoundary.kind === 'wall' && eastBoundary.status === 2
                  ? <div className='vertical-wall-damagedTwice'
                    id={eastBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, eastBoundaryCoord, eastBoundary.status)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'wall' && southBoundary.status === 0
                  ? <div className='horizontal-wall'
                    id={southBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, southBoundaryCoord, southBoundary.status)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'wall' && southBoundary.status === 1
                  ? <div className='horizontal-wall-damagedOnce'
                    id={southBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, southBoundaryCoord, southBoundary.status)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'wall' && southBoundary.status === 2
                  ? <div className='horizontal-wall-damagedTwice'
                    id={southBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, southBoundaryCoord, southBoundary.status)} />
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
  openOrCloseDoor: (coord, status) => {
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
