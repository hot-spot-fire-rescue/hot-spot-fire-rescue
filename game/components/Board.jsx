'use strict'
import React from 'react'
import {connect} from 'react-redux'

import {setupBoard} from '../utils/setup'
import {sortCoord,
        switchDoor,
        damageWall} from '../reducers/boundary'
import Danger from '../components/Danger'
import {movePlayer,
        endTurn} from '../reducers/player'


class Board extends React.Component {
  componentWillMount() {
    this.props.fireRef.once('value', (snapshot) => {
      if (!snapshot.exists()) this.props.fetchInitialData()
    })
  }

  render() {
    console.log('board re rendering')
    const {
      players,
      danger, 
      currentPlayerId,
      cells,
      boundaries,
      fetchInitialData,
      move,
      changeWallStatus,
      openOrCloseDoor,
      endTurn} = this.props

    const handleWallDamage = (event, wall) => {
      event.stopPropagation()
      changeWallStatus(wall)
    }

    const handleDoorSwitch = (event, door) => {
      event.stopPropagation()
      openOrCloseDoor(door.coord)
    }

    const handleEndTurnClick = (event) => {
      event.stopPropagation()
      endTurn()
    }

    const handleCellClick = (event, currentCell) => {
      event.stopPropagation()
      if (event.target.className === "className") {
        let sortedCoords = sortCoord([currentCell.cellNum, players.get(currentPlayerId).location])
        let nextBoundary = boundaries.get(sortedCoords.toString()) || ''

        move(currentPlayerId,
          cells.get(currentCell.cellNum),
          nextBoundary)
      }
    }

    const remainingAp = players.get(currentPlayerId) ? players.get(currentPlayerId).ap : 0

    return (
      <div>

        <button onClick={handleEndTurnClick}>End Turn</button>
        <h5>Player0-blue,  Player1-green,  Player2-red,  Player3-orange </h5>
        <h3>Player {currentPlayerId} has {remainingAp} AP left</h3>

        {
          cells.map(cell => {
            const eastBoundaryCoord = [cell.cellNum, cell.cellNum + 1].toString()
            const southBoundaryCoord = [cell.cellNum, cell.cellNum + 10].toString()
            const eastBoundary = boundaries.get(eastBoundaryCoord)
            const southBoundary = boundaries.get(southBoundaryCoord)
            const kind = danger.getIn([cell.cellNum, 'kind'])
            const status = danger.getIn([cell.cellNum, 'status'])
            const location = danger.getIn([cell.cellNum, 'location'])
            const player = players.find((val) => val.location === cell.cellNum)
            const fire = danger.get(cell.cellNum)
            

            return (
              <div key={cell.cellNum}
              className="cell"
              onClick={(evt) => handleCellClick(evt, cell)}>
                {
                  fire && <Danger location={location} kind={kind} status={status} />
                }
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

const mapState = ({board, boundary, player, danger}) => ({
  cells: board,
  boundaries: boundary,
  players: player.players,
  currentPlayerId: player.currentId,
  danger: danger
})

const mapDispatch = dispatch => ({
  fetchInitialData: () => {
    console.log('I am here')
    dispatch(setupBoard())
  },
  endTurn: () => {
    dispatch(endTurn())
  },
  openOrCloseDoor: (coord) => {
    dispatch(switchDoor(coord))
  },
  changeWallStatus: (coord) => {
    dispatch(damageWall(coord))
  },
  move: (id, nextCell, nextBoundary) => {
    dispatch(movePlayer(id, nextCell, nextBoundary))
  }
})

export default connect(mapState, mapDispatch)(Board)
