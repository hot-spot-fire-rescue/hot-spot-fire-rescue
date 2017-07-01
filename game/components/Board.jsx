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
        updatePlayer,
        pickUpOrDropVictim} from '../reducers/player'

import firebase from 'APP/fire'
import {loadPlayers} from './promises'

const fbAuth = firebase.auth()
const fbDB=firebase.database()

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
      players: loadPlayers, // Change name
      currentUserId: '',
      arrayUsers: []
    }
    this.handleCellClick = this.handleCellClick.bind(this)
    this.handleDoorSwitch = this.handleDoorSwitch.bind(this)
    this.handleWallDamage = this.handleWallDamage.bind(this)
    this.handleEndTurnClick = this.handleEndTurnClick.bind(this)
    this.handlePoiClick = this.handlePoiClick.bind(this)
    this.rescuedVictimCount = this.rescuedVictimCount.bind(this)
    this.lostVictimCount = this.lostVictimCount.bind(this)
    this.didGameEnd = this.didGameEnd.bind(this)
    this.removeUserCallback =this.removeUserCallback.bind(this)
    this.playerJoin = this.playerJoin.bind(this)
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
    this.props.endTurn()
  }

  handleCellClick(event, cell) {
    event.stopPropagation()

    if (event.target.className === 'cell') {
      const sortedCoords = sortCoord([cell.cellNum,
        this.props.players.get(this.props.currentPlayerId).location])
      const nextCell = this.props.cells.get(cell.cellNum)
      const nextBoundary = this.props.boundaries.get(sortedCoords.toString(), '')
      const nextCellDangerKind = this.props.danger.getIn([cell.cellNum, 'kind'], '')

      this.props.move(this.props.currentPlayerId,
                      nextCell,
                      nextBoundary,
                      nextCellDangerKind)
    }
  }

  handlePoiClick(event, victim, player) {
    event.stopPropagation()
    this.props.pickUpOrDropVictim(victim, this.props.currentPlayerId)
  }

  damageCount() {
    // TODO
  }

  rescuedVictimCount() {
    const rescued = this.props.victims.countBy(victim => victim.status)
    return rescued.get(2) || 0
  }

  lostVictimCount() {
    const lost = this.props.victims.countBy(victim => victim.status)
    return lost.get(3) || 0
  }

  didGameEnd() {
    if (this.damageCount() > 23) {
      // Building collapsed!
    }
    if (this.lostVictimCount() > 4) {
      // Defeat - 4 victims were lost
    }
    if (this.rescuedVictimCount > 6) {
      // Victory - 7 victims were rescued!
    }
  }

  removeUserCallback(event) {
    event.stopPropagation()
    // console.log(event.target.id)
    const targetIndex= this.state.arrayUsers.indexOf(event.target.id)
    this.state.arrayUsers.splice(targetIndex, 1)
    delete this.state.players[targetIndex]['uid']
    // console.log(this.state.players[targetIndex])
    this.setState({arrayUsers: this.state.arrayUsers})
  }

  playerJoin(event) {
    for (var i = 0; i < this.state.players.length; i++) {
      if (!this.state.players[i].hasOwnProperty('uid')) {
        this.state.players[i].uid = this.state.currentUserId
        loadPlayers[i].uid = this.state.currentUserId
        this.setState({players: this.state.players})
        // console.log('DO WE HAVE THIS.PROPS????', this.props)
        updatePlayer(this.state.players[i].id, this.state.currentUserId)
        break
      }
    }
  }

  render() {
    // console.log('board re rendering')
    // console.log(loadPlayers)
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
    let handlePoiClick = this.handlePoiClick
    let rescuedVictimCount = this.rescuedVictimCount
    let lostVictimCount = this.lostVictimCount
    let condition = this.state.players[currentPlayerId].uid !== this.state.currentUserId

    // don't put console logs in render
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
        <h5>Number of saved victims: {rescuedVictimCount()}</h5>
        <h5>Number of lost victims: {lostVictimCount()}</h5>

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
                  fire
                  && <Danger location={location} kind={kind} status={status} />
                }
                {
                  player
                  && <div className='player'
                    style={{backgroundColor: player.color}}/>
                }
                {
                  poi && poi.status === 0
                  && <div className='poi'>?</div>
                }
                {
                  poi && poi.status === 1 && !poi.carriedBy
                  && <div className={`poi victim-uncarried`}
                    onClick={(evt) => handlePoiClick(evt, poi, player)}/>
                }
                {
                  poi && poi.status === 1 && poi.carriedBy
                  && <div className={`poi victim-carried`}
                    onClick={(evt) => handlePoiClick(evt, poi, player)}/>
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
  endTurn: () => {
    dispatch(endTurn())
  },
  openOrCloseDoor: (coord) => {
    dispatch(switchDoor(coord))
  },
  changeWallStatus: (coord) => {
    dispatch(damageWall(coord))
  },
  move: (id, nextCell, nextBoundary, nextDanger) => {
    dispatch(movePlayer(id, nextCell, nextBoundary, nextDanger))
  },
  pickUpOrDropVictim: (victim, playerId) => {
    dispatch(pickUpOrDropVictim(victim, playerId))
  },
  updatePlayer: (id, uid) => {
    dispatch(updatePlayer(id, uid))
  }
})

export default connect(mapState, mapDispatch)(Board)
