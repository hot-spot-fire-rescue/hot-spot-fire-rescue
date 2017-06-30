'use strict'
import React from 'react'
import {connect} from 'react-redux'

import {setupBoard} from '../utils/setup'
import {sortCoord,
        switchDoor,
        damageWall} from '../reducers/boundary'
import Danger from '../components/Danger'
import {movePlayer,
       endTurn,
       updatePlayer} from '../reducers/player'
import {createDanger, addRandomSmoke} from '../reducers/danger'
import reducer from '../reducers/'

import firebase from 'APP/fire'
import {loadPlayers} from './promises'
const fbAuth = firebase.auth()
const fbDB=firebase.database()

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      players: loadPlayers,
      currentUserId: '',
      arrayUsers: []
    }
    this.handleCellClick = this.handleCellClick.bind(this)
    this.handleDoorSwitch = this.handleDoorSwitch.bind(this)
    this.handleWallDamage = this.handleWallDamage.bind(this)
    this.handleEndTurnClick = this.handleEndTurnClick.bind(this)
    this.removeUserCallback=this.removeUserCallback.bind(this)
    this.playerJoin=this.playerJoin.bind(this)
  }

  componentWillMount() {
    this.props.fireRef.once('value', (snapshot) => {
      if (!snapshot.exists()) this.props.fetchInitialData()
    })
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({currentUserId: user.uid})
      }
    })
  }
  handleWallDamage(event, wall) {
    event.stopPropagation()
    this.props.changeWallStatus(wall)
  }

  handleDoorSwitch(event, door) {
    event.stopPropagation()
    this.props.openOrCloseDoor(door.coord)
  }

  handleEndTurnClick(event) {
    event.stopPropagation()
    const isValid = (num) => {
      if (num % 10 === 0 || num % 10 === 9 || num >= 70|| num <= 10) {
        return false
      }
      return true
    }
    let locationToAddSmoke = 0
    while (!isValid(locationToAddSmoke)) {
      locationToAddSmoke = Math.floor(Math.random() * 79) + 1
    }
    const boundariesObj = this.props.boundaries.toObject()
    console.log('boundariesObj', boundariesObj)
    this.props.endTurn(locationToAddSmoke, boundariesObj)
  }

  handleCellClick(event, currentCell) {
    event.stopPropagation()

    if (event.target.className === 'cell') {
      const sortedCoords = sortCoord([currentCell.cellNum, this.props.players.get(this.props.currentPlayerId).location])
      const nextBoundary = this.props.boundaries.get(sortedCoords.toString()) || ''

      this.props.move(this.props.currentPlayerId,
                      this.props.cells.get(currentCell.cellNum),
                      nextBoundary)
    }
  }

  removeUserCallback(event) {
    event.stopPropagation()
    const targetIndex= this.state.arrayUsers.indexOf(event.target.id)
    this.state.arrayUsers.splice(targetIndex, 1)
    delete this.state.players[targetIndex]['uid']
    this.setState({arrayUsers: this.state.arrayUsers})
  }

  playerJoin(event) {
    for (var i = 0; i < this.state.players.length; i++) {
      if (!this.state.players[i].hasOwnProperty('uid')) {
        this.state.players[i].uid = this.state.currentUserId
        loadPlayers[i].uid = this.state.currentUserId
        this.setState({players: this.state.players})
        updatePlayer(this.state.players[i].id, this.state.currentUserId)
        break
      }
    }
  }

  render() {
    const {
      players,
      danger,
      victims,
      currentPlayerId,
      cells,
      boundaries,
      fetchInitialData} = this.props

    let handleCellClick = this.handleCellClick
    let handleDoorSwitch = this.handleDoorSwitch
    let handleWallDamage = this.handleWallDamage
    let handleEndTurnClick = this.handleEndTurnClick
    let condition= this.state.players[currentPlayerId].uid!==this.state.currentUserId
    if (condition) {
      handleCellClick = () => (console.log('It is not your turn yet.  Have patience, padawan'))
      handleDoorSwitch = () => (console.log('It is not your turn yet.  Have patience, padawan'))
      handleWallDamage = () => (console.log('It is not your turn yet.  Have patience, padawan'))
      handleEndTurnClick = () => (console.log('It is not your turn yet.  Have patience, padawan'))
    }
    const remainingAp = players.get(currentPlayerId) ? players.get(currentPlayerId).ap : 0

    return (
      <div>
        <br></br>
        <button id={this.state.currentUserId} onClick={this.playerJoin}> Join</button>
        <button disabled={condition} onClick={handleEndTurnClick}>End Turn</button>
        <h6>Player0-blue, Player1-green, Player2-purple, Player3-orange </h6>
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
            const poi = victims.find((val) => val.location === cell.cellNum)
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
                  poi
                  && <div className='poi'></div>
                }
                {
                  eastBoundary && eastBoundary.kind === 'wall' && eastBoundary.status === 0
                  && <div className='vertical-wall'
                    id={eastBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, eastBoundary)} />
                }
                {
                  eastBoundary && eastBoundary.kind === 'wall' && eastBoundary.status === 1
                  && <div className='vertical-wall-damagedOnce'
                    id={eastBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, eastBoundary)} />
                }
                {
                  eastBoundary && eastBoundary.kind === 'wall' && eastBoundary.status === 2
                  && <div className='vertical-wall-damagedTwice'
                    id={eastBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, eastBoundary)} />
                }
                {
                  southBoundary && southBoundary.kind === 'wall' && southBoundary.status === 0
                  && <div className='horizontal-wall'
                    id={southBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, southBoundary)} />
                }
                {
                  southBoundary && southBoundary.kind === 'wall' && southBoundary.status === 1
                  && <div className='horizontal-wall-damagedOnce'
                    id={southBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, southBoundary)} />
                }
                {
                  southBoundary && southBoundary.kind === 'wall' && southBoundary.status === 2
                  && <div className='horizontal-wall-damagedTwice'
                    id={southBoundaryCoord}
                    onClick={(evt) => handleWallDamage(evt, southBoundary)} />
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

const mapState = ({board, boundary, player, victim, danger}) => ({
  cells: board,
  boundaries: boundary,
  players: player.players,
  victims: victim,
  currentPlayerId: player.currentId,
  danger: danger
})

const mapDispatch = dispatch => ({
  fetchInitialData: () => {
    dispatch(setupBoard())
  },
  endTurn: (location, boundaries) => {
    dispatch(endTurn(location, boundaries))
  },
  openOrCloseDoor: (coord) => {
    dispatch(switchDoor(coord))
  },
  changeWallStatus: (coord) => {
    dispatch(damageWall(coord))
  },
  move: (id, nextCell, nextBoundary) => {
    dispatch(movePlayer(id, nextCell, nextBoundary))
  },
  updatePlayer: (id, uid) => {
    dispatch(updatePlayer(id, uid))
  }
})

export default connect(mapState, mapDispatch)(Board)
