'use strict'
import React from 'react'
import {connect} from 'react-redux'

import {switchDoor, switchWall} from './reducers/board'
import {setupBoard} from './utils/setup'
import {setPlayer, setNextPlayer, subtractAp} from './reducers/player'

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
      setPlayerLocation,
      setNextPlayer,
      useAp} = this.props

    const handleWallDamage = (event, coord, status) => {
      if (adjacentWallOrDoor(coord, players[currentPlayerId].location) === false) {
        alert('This wall is too far !')
        return
      }
      if (players[currentPlayerId].ap === 0) {
        alert('No Action Points available !')
        return
      }
      event.stopPropagation()
      let newStatus
      if (status === 0) {
        newStatus = 1
      } else if (status === 1) {
        newStatus = 2
      }
      this.props.changeWallStatus(coord, newStatus)
      this.props.useAp(currentPlayerId, 1)
    }

    const handleDoorSwitch = (event, coord, status) => {
      if (adjacentWallOrDoor(coord, players[currentPlayerId].location) === false) {
        alert('This wall is too far !')
        return
      }
      if (players[currentPlayerId].ap === 0) {
        alert('No Action Points available !')
        return
      }
      event.stopPropagation()
      let newStatus = (status === 0) ? 1 : 0
      this.props.openOrCloseDoor(coord, newStatus)
      this.props.useAp(currentPlayerId, 1)
    }

    const adjacentWallOrDoor = (doorOrWallLocation, playerLocation) => {
      let location = doorOrWallLocation.slice(1, -1).split(',')
      console.log('player', playerLocation)
      return (Number(location[0]) === playerLocation || Number(location[1]) === playerLocation)
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

    const findApCost = (next) => {
      const nextCellStatus = cells.get(next).status
      if (nextCellStatus === 0) {
        return 1
      } else if (nextCellStatus === 1) { // TODO: check if carrying victim
        return 2
      }
    }

    const handleCellClick = (event, cellNum) => {
      event.stopPropagation()
      const currentPlayer = players[currentPlayerId]
      const currentPlayerLocation = currentPlayer.location
      const apCost = findApCost(cellNum)

      if (cellNum !== currentPlayerLocation &&
          isAdjacent(cellNum, currentPlayerLocation) &&
          isPassable(cellNum, currentPlayerLocation) &&
          currentPlayer.ap - apCost >= 0) {
        setPlayerLocation(currentPlayerId, cellNum)
        useAp(currentPlayerId, apCost)
      } else {
        alert('this is not a legal move :(')
      }
    }

    const handleEndTurnClick = () => {
      let nextPlayerId = (currentPlayerId === players.length - 1) ? 0 : currentPlayerId + 1
      setNextPlayer(nextPlayerId)
    }

    const remainingAp = players[currentPlayerId] ? players[currentPlayerId].ap : 0

    return (
      <div>
        <button onClick={() => handleEndTurnClick()}>End Turn</button>
        <h5>Player0-blue,  Player1-green,  Player2-red,  Player3-orange </h5>
        <h3>Player {currentPlayerId} has {remainingAp} AP left</h3>

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
  },
  setNextPlayer: (id) => {
    dispatch(setNextPlayer(id))
  },
  useAp: (id, newLocation) => {
    dispatch(subtractAp(id, newLocation))
  }
})

export default connect(mapState, mapDispatch)(Gameboard)
