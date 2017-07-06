'use strict'
import React from 'react'
import { connect } from 'react-redux'
import {Grid, Row, Col, Clearfix, Image} from 'react-bootstrap'
import Alert from 'react-s-alert'

import { setupBoard } from '../utils/setup'
import {
  sortCoord,
  switchDoor,
  damageWall,
  explodeBoundaries
} from '../reducers/boundary'
import Danger from '../components/Danger'
import {
  createPlayer,
  removePlayer,
  movePlayer,
  endTurn,
  updatePlayer,
  pickUpOrDropVictim,
  checkForFireDamage,
  isValidNextCell,
  isValidStartingCell
} from '../reducers/player'
import {
  addNextPoi,
  clearPopups
} from '../reducers/victim'
import {
  createDanger,
  addRandomSmoke,
  removeDanger,
  explode,
  flashOver
} from '../reducers/danger'
import reducer from '../reducers/'
import Chatroom from './Chatroom'
import GameEnd from './GameEnd'
import MobileTearSheet from './MobileTearSheet'
import Avatar from 'material-ui/Avatar'
import {List, ListItem} from 'material-ui/List'
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import PersonAdd from 'material-ui/svg-icons/social/person-add'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import firebase from 'APP/fire'
const fbAuth = firebase.auth()
const fbDB = firebase.database()

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
      currentUserId: '',
      currentUsername: '',
      userIsPlaying: true,
      gameStarted: false,
      value: 'https://images.vexels.com/media/users/3/140260/isolated/preview/d173308adbddefddd5c71c6c59dfdded-firefighter-running-with-axe-by-vexels.png'
    }
    this.isLegalCell = this.isLegalCell.bind(this)
    this.handleCellClick = this.handleCellClick.bind(this)
    this.handleDoorSwitch = this.handleDoorSwitch.bind(this)
    this.handleWallDamage = this.handleWallDamage.bind(this)
    this.handleEndTurnClick = this.handleEndTurnClick.bind(this)
    this.handlePoiClick = this.handlePoiClick.bind(this)
    this.rescuedVictimCount = this.rescuedVictimCount.bind(this)
    this.damageCount = this.damageCount.bind(this)
    this.lostVictimCount = this.lostVictimCount.bind(this)
    this.didGameEnd = this.didGameEnd.bind(this)
    this.onPlayerSubmit = this.onPlayerSubmit.bind(this)
    this.removePlayerCallback = this.removePlayerCallback.bind(this)
    this.handleGameStatusChange=this.handleGameStatusChange.bind(this)
    this.handleChange= this.handleChange.bind(this)
  }

  componentWillMount() {
    this.props.fireRef.once('value', (snapshot) => {
      if (!snapshot.exists()) this.props.fetchInitialData()
    })
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ currentUserId: user.uid, currentUsername: user.displayName })
      }
    })
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  handleGameStatusChange() {
    this.setState({gameStarted: true})
  }

  componentWillReceiveProps(nextProps) {
    const popups = nextProps.victimsPopups.concat(nextProps.playerPopups)
    popups.forEach(popup => {
      if (popup.event === 'lost') Alert.error(popup.message)
      if (popup.event === 'success') Alert.success(popup.message)
      if (popup.event === 'info') Alert.info(popup.message)
    })
    clearPopups()
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
      return !(num % 10 === 0 || num % 10 === 9 || num >= 70 || num <= 10)
    }

    let locationToAddSmoke = 0
    while (!isValid(locationToAddSmoke)) {
      locationToAddSmoke = Math.floor(Math.random() * 79) + 1
      // locationToAddSmoke = 57
    }

    const boundariesObj = this.props.boundaries.toObject()
    // helper function - to check the danger status of a cell
    const cellDangerStatus = (location) => {
      const targetCellKind = this.props.danger.getIn([location, 'kind'])
      const targetCellStatus = this.props.danger.getIn([location, 'status'])
      if (targetCellKind === 'fire' && targetCellStatus === 1) {
        return 'fire'
      } else if (targetCellKind === 'smoke' && targetCellStatus === 1) {
        return 'smoke'
      }
      return undefined
    }

    let actionCellDangerStatus = cellDangerStatus(locationToAddSmoke)
    actionCellDangerStatus = (actionCellDangerStatus === undefined) ? 'no status' : actionCellDangerStatus

    // always check if there is explosion, trigger explosion if target cell is already on fire
    const currentDanger =[]
    if (cellDangerStatus(locationToAddSmoke) === 'fire') {
      const dangerObj = this.props.danger.toObject()
      for (var key in dangerObj) {
        if (dangerObj.hasOwnProperty(key) && dangerObj[key] !== undefined) {
          currentDanger.push(dangerObj[key].toObject())
        }
      }

      this.props.explode(actionCellDangerStatus, locationToAddSmoke, boundariesObj)
      this.props.explodeBoundaries(actionCellDangerStatus, locationToAddSmoke, currentDanger)
    }

    // After dealing with explosion, endTurn will calculate loss and damages
    this.props.endTurn(locationToAddSmoke, boundariesObj)
    this.props.flashOver(boundariesObj)

    // check for fire on POIs and characters
    const fireLocations = this.props.danger.map(danger => {
      if (danger && danger.get('kind') === 'fire' && danger.get('status') === 1) {
        return true
      } else {
        return false
      }
    })

    this.props.checkFireDamage(fireLocations.toArray())
    // add new POI only if < 3 are on board
    const poiStatusCount = this.props.victims.countBy(poi => poi.status)
    if ((poiStatusCount.get(0, 0) + poiStatusCount.get(1, 0)) < 3) {
      let locationToAddPoi = 0
      const hasPoiOrCharacter = (location) => (
        Boolean(this.props.players.find(player => player.location === location) ||
                this.props.victims.find(victim => victim.location === location))
      )
      while (!(isValid(locationToAddPoi) &&
             !hasPoiOrCharacter(locationToAddPoi))) {
        locationToAddPoi = Math.floor(Math.random() * 79) + 1
      }
      this.props.removeDanger(locationToAddPoi) // clear fire and smoke
      this.props.addPoi(locationToAddPoi)
    }
  }

  isLegalCell(cell) {
    let currentP = this.props.players.get(this.props.currentPlayerId)
    if (currentP) {
      let sortedCoords = sortCoord([cell.cellNum, currentP.location])
      let nextCellDangerKind = (this.props.danger.getIn([cell.cellNum, 'status']) === 1)
        ? this.props.danger.getIn([cell.cellNum, 'kind'], '')
        : ''
      let nextBoundary = this.props.boundaries.get(sortedCoords.toString(), '')

      return isValidNextCell(cell, nextCellDangerKind, nextBoundary, currentP)
    } else {
      return false
    }
  }

  handleCellClick(event, cell) {
    event.stopPropagation()

    if (event.target.className.includes('cell')) {
      let sortedCoords = sortCoord([cell.cellNum,
        this.props.players.get(this.props.currentPlayerId).location])
      let nextCell = this.props.cells.get(cell.cellNum)
      let nextBoundary = this.props.boundaries.get(sortedCoords.toString(), '')
      let nextCellDangerKind = (this.props.danger.getIn([cell.cellNum, 'status']) === 1)
        ? this.props.danger.getIn([cell.cellNum, 'kind'], '')
        : ''

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
    const wallsByStatus = this.props.boundaries
                          .filter(boundary => boundary.kind === 'wall')
                          .countBy(wall => wall.status)
    return wallsByStatus.get(1, 0) + (wallsByStatus.get(2, 0) * 2)
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
    const results = [
      ['YOU WON', 'Great job! You rescued 7 victims from the burning buliding'],
      ['GAME OVER', 'The building collapsed'],
      ['GAME OVER', '4 victims were lost']]
    let info
    if (this.damageCount() > 23) {
      // Building collapsed!
      // console.info(`GAME OVER: The building collapsed`)
      info = results[1]
      console.log('info', info)
    }
    if (this.lostVictimCount() > 3) {
      // Defeat - 4 victims were lost
      console.info(`GAME OVER: 4 victims were lost`)
      info = results[2]
    }
    if (this.rescuedVictimCount > 6) {
      // Victory - 7 victims were rescued!
      console.info(`YOU WON! You rescued 7 victims from the burning buliding`)
      info = results[0]
    }
    return info
  }

  onPlayerSubmit(event) {
    event.preventDefault()
    let playerInfo = {
      id: this.state.currentUserId,
      ap: 5,
      location: -1,
      avatar: event.target.avatar.value,
      username: this.state.currentUsername
    }
    this.props.createAPlayer(playerInfo)
    this.setState({userIsPlaying: true})
  }

  removePlayerCallback(index) {
    const removeAPlayer = this.props.removeAPlayer
    removeAPlayer(index)
  }

  render() {
    const {
      players,
      danger,
      victims,
      currentPlayerId,
      cells,
      boundaries,
      fetchInitialData } = this.props

    let isLegalCell = this.isLegalCell
    let handleCellClick = this.handleCellClick
    let handleDoorSwitch = this.handleDoorSwitch
    let handleWallDamage = this.handleWallDamage
    let handleEndTurnClick = this.handleEndTurnClick
    let handlePoiClick = this.handlePoiClick
    let damageCount = this.damageCount
    let didGameEnd = this.didGameEnd
    let rescuedVictimCount = this.rescuedVictimCount
    let lostVictimCount = this.lostVictimCount
    let condition
    let gameHasStarted= this.state.gameStarted
    if (players.size > 0) {
      condition = players.get(currentPlayerId).id !== this.state.currentUserId
    }

    let tooManyPlayers = players.size > 5
    let notEnoughPlayers = players.size < 2
    let spectating = this.state.userIsPlaying === false
    let doNotShowTheBoard = (notEnoughPlayers && !spectating) || gameHasStarted ===false
    // if (condition || spectating || this.state.gameStarted === false) {
    //   handleCellClick = () => (console.log('It is not your turn yet.  Have patience, padawan'))
    //   handleDoorSwitch = () => (console.log('It is not your turn yet.  Have patience, padawan'))
    //   handleWallDamage = () => (console.log('It is not your turn yet.  Have patience, padawan'))
    //   handleEndTurnClick = () => (console.log('It is not your turn yet.  Have patience, padawan'))
    // }

    const remainingAp = players.get(currentPlayerId) ? players.get(currentPlayerId).ap : 0

    return <div className="play-area">
      { doNotShowTheBoard
        ? (
          <div className="row">
            <h3 className="text-center">Join the game (Min: 2 players, Max: 6 players)</h3>
              <div className="col-md-4 col-md-offset-4">
                <form onSubmit={this.onPlayerSubmit}>
                  <div className="form-group" style={{display: 'inline-block'}}>
                      <img className='player' src={this.state.value} style={{display: 'inline-block'}}/>
                      <select id="avatar" onChange={this.handleChange} value={this.state.value}>
                        <option value="https://images.vexels.com/media/users/3/140260/isolated/preview/d173308adbddefddd5c71c6c59dfdded-firefighter-running-with-axe-by-vexels.png">Select Your Avatar</option>
                          <option value="/images/avatars/Jing.png">Jing</option>
                          <option value="/images/avatars/Yiling2.png">Yiling</option>
                          <option value="/images/avatars/Marina2.jpeg">Marina</option>
                          <option value='/images/avatars/Ketti.jpg'>Ketti</option>
                          <option value="/images/avatars/sriracha.jpg">Sriracha Fireperson</option>
                          <option value="/images/avatars/Dalmatian.png">Dalmatian</option>
                          <option value='/images/avatars/Firewoman.png'>Firewoman</option>
                          <option value='/images/avatars/Sarah.png'>Schubsman</option>
                          <option value='/images/avatars/YellowPuppy.png'>Golden Retriever Puppy</option>
                          <option value='/images/avatars/FirefightingPotato.png'>Firefighting Potato</option>
                          <option value='/images/avatars/Octocat.png'>Octocat</option>
                      </select>
                  </div>
                  <IconButton type='submit' disabled={tooManyPlayers} style={{top: '6px'}}>
                    <PersonAdd />
                  </IconButton>
                </form>

              <MobileTearSheet height={400} style={{position: 'absolute', right: '100px', borderRadius: '20px'}}>
                <div style={{backgroundColor: 'rgba(85, 107, 47, 0.3)', borderRadius: '20px'}}>
                  <List>
                    <Subheader>Current Players</Subheader>
                    {
                    players.map((player) => {
                      let idx = players.indexOf(player)
                      return (
                        <div key={idx} >
                          <ListItem
                            primaryText={player.username}
                            leftAvatar={<Avatar src={player.avatar} />}
                            rightIcon={<DeleteIcon onClick= {() => this.removePlayerCallback(idx)} disabled={player.id!==this.state.currentUserId }/>}
                          />
                        </div>
                      )
                    })
                  }
                  </List>
                </div>
              </MobileTearSheet>
                <FlatButton disabled={players.size < 2} onClick={this.handleGameStatusChange}>
                  Start/Resume the Game</FlatButton>
                <br />
                <FlatButton disabled={players.size < 1} onClick= {() => {
                  this.setState({userIsPlaying: false})
                }}> Just Spectating</FlatButton>
                { /* {
                  (players.size < 1)?<p>You cannot spectate an empty game</p>: null
                } */ }

            </div>
          </div>
        ) : (
          <div className="row">
            <ul className='col-md-4 col-md-offset-4 playerList'>
              {
                players.map((player) => {
                  let idx = players.indexOf(player)
                  let size='0px'
                  if (idx === currentPlayerId) {
                    size='20px'
                  }
                  return (
                    <div style={{paddingLeft: size}} id='wrapper2'>
                      <img className='listPlayer' src= {player.avatar} /><p className='text'>{player.username}</p><p style={{position: 'relative', bottom: '-1em', left: '1em'}}>AP: {player.ap}</p>
                      <div style={{paddingBottom: '20px'}} ></div>
                    </div>

                  )
                })
              }
            </ul>
            {
              (!this.state.gameStarted && !spectating)?<button onClick={() => this.setState({gameStarted: true})}>Start the Game</button>:<div></div>
            }
            {
              didGameEnd() ? <GameEnd info={didGameEnd()} /> : null
            }

            <br></br>
            <div >
              <RaisedButton className='endTurnButton' backgroundColor='rgb(255, 187, 51)' disabled={condition} onClick={handleEndTurnClick}>End Turn</RaisedButton>
            </div>
            <br></br>
              <div className='playerAP'>{players.get(currentPlayerId).location===-1? <p style={{position: 'relative', bottom: '50px', right: '70em'}}>Hey there, {this.state.currentUsername}! Please choose your starting point outside of the burning house</p>:null}</div>
              <div className='scoreBoard' id="wrapper">
                <img src='/images/hospital.png' style={{width: '100px', height: '100px', position: 'relative', left: '30px'}} /><h5 className="text"> {rescuedVictimCount()}/10 <p className='text2'>People Saved</p></h5>
                <img src='/images/skull.png' style={{width: '100px', height: '100px'}} /><h5 className="text"> {lostVictimCount()}/4 <p className='text2'>People Lost</p></h5>
                <img src='/images/building_on_fire.svg' style={{width: '100px', height: '100px'}} /><h5 className="text"> {damageCount()}/24 <p className='text2'>Building Damage</p></h5>
              </div>
          <Row>
            <Col sm={9}>
            <div className='gameboard'>
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
                    <div key={cell.cellNum} id={cell.cellNum}
                      className={isLegalCell(cell) || (players.get(currentPlayerId).location===-1 && isValidStartingCell(cell.cellNum))? 'cell-highlighted' : 'cell'}
                      onClick={(evt) => handleCellClick(evt, cell)}>
                      {
                        fire
                        && <Danger location={location} kind={kind} status={status} />
                      }
                      {
                        player
                        && <img className='player'
                          src={player.avatar } />
                      }
                      {
                        poi && poi.status === 0
                        && <div className={`poi poi-unrevealed`}/>
                      }
                      {
                        poi && poi.status === 1 && (poi.carriedBy === null)
                        && <div className={`poi poi-${poi.type}`}
                          onClick={(evt) => handlePoiClick(evt, poi, player)} />
                      }
                      {
                        poi && poi.status === 1 && !(poi.carriedBy === null)
                        && <div className={`poi poi-${poi.type} carried`}
                          onClick={(evt) => handlePoiClick(evt, poi, player)} />
                      }
                      {
                        eastBoundary && eastBoundary.kind === 'wall' && eastBoundary.status === 0
                        && <div className={`vertical-wall`}
                          onClick={(evt) => handleWallDamage(evt, eastBoundary)} />
                      }
                      {
                        eastBoundary && eastBoundary.kind === 'wall' && eastBoundary.status === 1
                        && <div className={`vertical-wall vertical-wall-damaged-once`}
                          onClick={(evt) => handleWallDamage(evt, eastBoundary)} />
                      }
                      {
                        eastBoundary && eastBoundary.kind === 'wall' && eastBoundary.status === 2
                        && <div className={`vertical-wall vertical-wall-damaged-once damaged-twice`}/>
                      }
                      {
                        southBoundary && southBoundary.kind === 'wall' && southBoundary.status === 0
                        && <div className={`horizontal-wall`}
                          onClick={(evt) => handleWallDamage(evt, southBoundary)} />
                      }
                      {
                        southBoundary && southBoundary.kind === 'wall' && southBoundary.status === 1
                        && <div className={`horizontal-wall horizontal-wall-damaged-once`}
                          onClick={(evt) => handleWallDamage(evt, southBoundary)} />
                      }
                      {
                        southBoundary && southBoundary.kind === 'wall' && southBoundary.status === 2
                        && <div className={`horizontal-wall horizontal-wall-damaged-once damaged-twice`}/>
                      }
                      {
                        eastBoundary && eastBoundary.kind === 'door'
                        && eastBoundary.status === 0
                        && <div className={`door vertical-door-closed`}
                          onClick={(evt) => handleDoorSwitch(evt, eastBoundary)} />
                      }
                      {
                        eastBoundary && eastBoundary.kind === 'door'
                        && eastBoundary.status === 1
                        && <div className={`door vertical-door-open`}
                          onClick={(evt) => handleDoorSwitch(evt, eastBoundary)} />
                      }
                      {
                        eastBoundary && eastBoundary.kind === 'door'
                        && eastBoundary.status === 2
                        && <div className={`door vertical-door-destroyed`}/>
                      }
                      {
                        southBoundary && southBoundary.kind === 'door'
                        && southBoundary.status === 0
                        && <div className={`door horizontal-door-closed`}
                          onClick={(evt) => handleDoorSwitch(evt, southBoundary)} />
                      }
                      {
                        southBoundary && southBoundary.kind === 'door'
                        && southBoundary.status === 1
                        && <div className={`door horizontal-door-open`}
                          onClick={(evt) => handleDoorSwitch(evt, southBoundary)} />
                      }
                      {
                        southBoundary && southBoundary.kind === 'door'
                        && southBoundary.status === 2
                        && <div className={`door horizontal-door-destroyed`}/>
                      }
                    </div>
                  )
                })
              }
            </div>
            </Col>
            <Col sm={3}>
              <Chatroom username={this.state.currentUsername}/>
            </Col>
          </Row>
          </div>
        )
    }
   </div>
  }
}

// -- // -- // Container // -- // -- //

const mapState = ({ board, boundary, player, victim, danger }) => ({
  cells: board,
  boundaries: boundary,
  players: player.players,
  playerPopups: player.popups,
  victims: victim.poi,
  victimsPopups: victim.popups,
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
  move: (id, nextCell, nextBoundary, nextDanger) => {
    dispatch(movePlayer(id, nextCell, nextBoundary, nextDanger))
  },
  pickUpOrDropVictim: (victim, playerId) => {
    dispatch(pickUpOrDropVictim(victim, playerId))
  },
  updatePlayer: (id, uid) => {
    dispatch(updatePlayer(id, uid))
  },
  explode: (actionCellDangerStatus, explosionLocation, boundariesObj) => {
    dispatch(explode(actionCellDangerStatus, explosionLocation, boundariesObj))
  },
  explodeBoundaries: (actionCellDangerStatus, explosionLocation, danger) => {
    dispatch(explodeBoundaries(actionCellDangerStatus, explosionLocation, danger))
  },
  addPoi: (location) => {
    dispatch(addNextPoi(location))
  },
  removeDanger: (location) => {
    dispatch(removeDanger(location))
  },
  checkFireDamage: (fireLocations) => {
    dispatch(checkForFireDamage(fireLocations))
  },
  flashOver: (boundaries) => {
    dispatch(flashOver(boundaries))
  },
  createAPlayer: (playerInfo) => {
    dispatch(createPlayer(playerInfo.id, playerInfo.ap, playerInfo.location, playerInfo.avatar, playerInfo.username))
  },
  removeAPlayer: (player) => {
    dispatch(removePlayer(player))
  },
  clearPopups: () => {
    dispatch(clearPopups())
  }
})

export default connect(mapState, mapDispatch)(Board)
