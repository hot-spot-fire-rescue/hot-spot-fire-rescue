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
      setNextPlayer,
      updateAp} = this.props

    const handleWallSwitch = (event, coord, status) => {event.stopPropagation()
      let newStatus = (status === 0) ? 1 : 0
      this.props.changeWallStatus(coord, newStatus)
    }

    const handleWallDamage = (event, coord, status) => {
      event.stopPropagation()
      if (adjacentWallOrDoor(coord, players[currentPlayerId].location) === false) {
        alert('This wall is too far !')
        return
      }
      if (players[currentPlayerId].ap < 2) {
        alert('No Action Points available !')
        return
      }
      let newStatus
      if (status === 0) {
        newStatus = 1
      } else if (status === 1) {
        newStatus = 2
      }
      this.props.changeWallStatus(coord, newStatus)
      this.props.updateAp(currentPlayerId, players[currentPlayerId].ap - 2)
    }

    const handleDoorSwitch = (event, coord, status) => {
      event.stopPropagation()
      if (adjacentWallOrDoor(coord, players[currentPlayerId].location) === false) {
        alert('This wall is too far !')
        return
      }
      if (players[currentPlayerId].ap === 0) {
        alert('No Action Points available !')
        return
      }
      let newStatus = (status === 0) ? 1 : 0
      this.props.openOrCloseDoor(coord, newStatus)

      newStatus = (status === 0) ? 1 : 0
      this.props.openOrCloseDoor(coord, newStatus)
      this.props.updateAp(currentPlayerId, players[currentPlayerId].ap - 1)
    }

    const adjacentWallOrDoor = (doorOrWallLocation, playerLocation) => {
      let location = doorOrWallLocation.slice(1, -1).split(',')
      console.log('player', playerLocation)
      return (Number(location[0]) === playerLocation || Number(location[1]) === playerLocation)

    }

    const handleEndTurnClick = () => {
      const nextPlayerId = (currentPlayerId === players.length - 1) ? 0 : currentPlayerId + 1
      // if current AP > 4, set to 4
      const currentPlayer = players[currentPlayerId]
      if (currentPlayer.ap > 4) {
        updateAp(currentPlayerId, 4)
      }
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
                  eastBoundary && eastBoundary.kind === 'wall'
                  ? <div className='vertical-wall'
                    onClick={(evt) => handleWallSwitch(evt, eastBoundaryCoord, eastBoundary.status)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'wall'
                  ? <div className='horizontal-wall'
                    onClick={(evt) => handleWallSwitch(evt, southBoundaryCoord)} />
                  : null
                }
                {
                  eastBoundary && eastBoundary.kind === 'door' && eastBoundary.status === 0
                  ? <div className='vertical-door-closed'
                    onClick={(evt) => handleDoorSwitch(evt, eastBoundaryCoord, eastBoundary.status)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'door' && southBoundary.status === 0
                  ? <div className='horizontal-door-closed'
                    onClick={(evt) => handleDoorSwitch(evt, southBoundaryCoord, eastBoundary.status)} />
                  : null
                }
                {
                  eastBoundary && eastBoundary.kind === 'door' && eastBoundary.status === 1
                  ? <div className='vertical-door-open'
                    onClick={(evt) => handleDoorSwitch(evt, eastBoundaryCoord, eastBoundary.status)} />
                  : null
                }
                {
                  southBoundary && southBoundary.kind === 'door' && southBoundary.status === 1
                  ? <div className='horizontal-door-open'
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
