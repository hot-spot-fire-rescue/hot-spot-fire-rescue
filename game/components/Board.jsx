'use strict'
import React from 'react'
import {connect} from 'react-redux'

import {setupBoard} from '../utils/setup'
import {sortCoord,
        switchDoor,
        damageWall} from '../reducers/boundary'
import {movePlayer,
        setNextPlayer,
        setAp} from '../reducers/player'

class Board extends React.Component {
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
      move,
      changeWallStatus,
      openOrCloseDoor,
      setNextPlayer,
      updateAp} = this.props

    const handleWallDamage = (event, wall) => {
      event.stopPropagation()
      let wallCoord = wall.coord
      let currentPlayer = players.get(currentPlayerId)

      if (isBoundaryAdjacent(wallCoord, currentPlayer.location) === false) {
        alert('This wall is too far !')
        return
      }
      if (currentPlayer.ap < 2) {
        alert('No Action Points available !')
        return
      }
      let newStatus
      if (wall.status === 0) {
        newStatus = 1
      } else if (wall.status === 1) {
        newStatus = 2
      }
      changeWallStatus(wallCoord, newStatus)
      updateAp(currentPlayerId, currentPlayer.ap - 2)
    }

    const handleDoorSwitch = (event, door) => {
      event.stopPropagation()
      let doorCoord = door.coord
      let currentPlayer = players.get(currentPlayerId)

      if (isBoundaryAdjacent(doorCoord, currentPlayer.location) === false) {
        alert('This wall is too far !')
        return
      }
      if (currentPlayer.ap === 0) {
        alert('No Action Points available !')
        return
      }
      let newStatus = (door.status === 0) ? 1 : 0
      openOrCloseDoor(doorCoord, newStatus)
      updateAp(currentPlayerId, currentPlayer.ap - 1)
    }

    const isBoundaryAdjacent = (boundaryLocation, playerLocation) => {
      return (boundaryLocation[0] === playerLocation ||
              boundaryLocation[1] === playerLocation)
    }

    const handleEndTurnClick = () => {
      const nextPlayerId = (currentPlayerId === players.count() - 1)
                           ? 0 : currentPlayerId + 1
      const currentPlayer = players.get(currentPlayerId)
      // add 4 AP to current AP for next turn
      updateAp(currentPlayerId, currentPlayer.ap + 4)
      setNextPlayer(nextPlayerId)
    }

    const handleOnClick = (event, currentCell) => {
      event.stopPropagation()

      let sortedCoords = sortCoord([currentCell.cellNum, players.get(currentPlayerId).location])
      let nextBoundary = boundaries.get(sortedCoords.toString()) || ''

      move(currentPlayerId,
           cells.get(currentCell.cellNum),
           nextBoundary)
    }

    const remainingAp = players.get(currentPlayerId) ? players.get(currentPlayerId).ap : 0

    return (
      <div>

        <button onClick={() => handleEndTurnClick()}>End Turn</button>
        <h5>Player0-blue,  Player1-green,  Player2-red,  Player3-orange </h5>
        <h3>Player {currentPlayerId} has {remainingAp} AP left</h3>

        {
          cells.map(cell => {
            const eastBoundaryCoord = [cell.cellNum, cell.cellNum + 1].toString()
            const southBoundaryCoord = [cell.cellNum, cell.cellNum + 10].toString()
            const eastBoundary = boundaries.get(eastBoundaryCoord)
            const southBoundary = boundaries.get(southBoundaryCoord)
            const player = players.find((val) => val.location === cell.cellNum)

            return (
              <div key={cell.cellNum}
              className="cell"
              onClick={(evt) => handleOnClick(evt, cell)}>
                {
                  player
                  && <div className='player'
                    style={{backgroundColor: player.color}}/>
                }
                {
                  eastBoundary && eastBoundary.kind === 'wall' && eastBoundary.status === 0
                  ? <div className='vertical-wall'
                    id={eastBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, eastBoundary)} />
                  : null
                }
                {
                  eastBoundary && eastBoundary.kind === 'wall' && eastBoundary.status === 1
                  ? <div className='vertical-wall-damagedOnce'
                    id={eastBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, eastBoundary)} />
                  : null
                }
                {
                  eastBoundary && eastBoundary.kind === 'wall' && eastBoundary.status === 2
                  ? <div className='vertical-wall-damagedTwice'
                    id={eastBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, eastBoundary)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'wall' && southBoundary.status === 0
                  ? <div className='horizontal-wall'
                    id={southBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, southBoundary)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'wall' && southBoundary.status === 1
                  ? <div className='horizontal-wall-damagedOnce'
                    id={southBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, southBoundary)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'wall' && southBoundary.status === 2
                  ? <div className='horizontal-wall-damagedTwice'
                    id={southBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, southBoundary)} />
                  : null
                }
                {
                  eastBoundary && eastBoundary.kind === 'door'
                  && eastBoundary.status === 0
                  && <div className='vertical-door-closed'
                    onClick={(evt) => handleDoorSwitch(evt, eastBoundary)} />
                }
                {
                  southBoundary && southBoundary.kind === 'door'
                  && southBoundary.status === 0
                  && <div className='horizontal-door-closed'
                    onClick={(evt) => handleDoorSwitch(evt, southBoundary)} />
                }
                {
                  eastBoundary && eastBoundary.kind === 'door'
                  && eastBoundary.status === 1
                  && <div className='vertical-door-open'
                    onClick={(evt) => handleDoorSwitch(evt, eastBoundary)} />
                }
                {
                  southBoundary && southBoundary.kind === 'door'
                  && southBoundary.status === 1
                  && <div className='horizontal-door-open'
                    onClick={(evt) => handleDoorSwitch(evt, southBoundary)} />
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

const mapState = ({board, boundary, player}) => ({
  cells: board,
  boundaries: boundary,
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
    dispatch(damageWall(coord, status))
  },
  move: (id, nextCell, nextBoundary) => {
    dispatch(movePlayer(id, nextCell, nextBoundary))
  },
  setNextPlayer: (id) => {
    dispatch(setNextPlayer(id))
  },
  updateAp: (id, newLocation) => {
    dispatch(setAp(id, newLocation))
  }
})

export default connect(mapState, mapDispatch)(Board)
