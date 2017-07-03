'use strict'
import React from 'react'
import {connect} from 'react-redux'
import {fireToSmoke, smokeToFire, removeFire, removeSmoke} from '../reducers/danger'
import {sortCoord} from '../reducers/boundary'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'

class Danger extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      anchorE1: null,
      open: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }

  handleClick(event) {
    event.preventDefault()
    this.setState({
      open: true,
      anchorE1: event.currentTarget
    })
  }

  handleRequestClose() {
    this.setState({
      open: false,
    })
  }

  render() {
    const {
      boundaries,
      currentPlayerId,
      players,
      kind,
      location,
      status,
      fireToSmoke,
      smokeToFire,
      removeFire,
      removeSmoke,
    } = this.props

    const sortedCoords = sortCoord([location, players.get(this.props.currentPlayerId, {}).location])
    const nextBoundary = boundaries.get(sortedCoords.toString()) || ''

    if (kind === 'fire' && status === 1) {
      return (
        <div>
          <img src='/images/fire.gif' className='fire' onClick={this.handleClick}/>
          <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <MenuItem primaryText="Change To Smoke" onClick={() => fireToSmoke(location, nextBoundary)}/>
            <MenuItem primaryText="Extinguish Fire" onClick={() => removeFire(location, nextBoundary)}/>
          </Menu>
        </Popover>
      </div>
      )
    } else if (kind === 'smoke' && status === 1) {
      return (
        <div>
          <img src='/images/smoke.gif' className={'fire smoke'} onClick={this.handleClick}/>
          <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <MenuItem primaryText="Change To Fire" onClick={() => smokeToFire(location, nextBoundary)}/>
            <MenuItem primaryText="Extinguish Smoke" onClick={() => removeSmoke(location, nextBoundary)}/>
          </Menu>
        </Popover>
      </div>
      )
    } else {
      return (
      <div>
      </div>
      )
    }
  }
}

// -- // -- // Container // -- // -- //

const mapStateToProps = (state, ownProps) => ({
  boundaries: state.boundary,
  currentPlayerId: state.player.currentId,
  players: state.player.players,
  location: ownProps.location,
  kind: ownProps.kind,
  status: ownProps.status
})

const mapDispatchToProps = dispatch => ({
  fireToSmoke: (location, nextBoundary) => {
    dispatch(fireToSmoke(location, nextBoundary))
  },
  smokeToFire: (location, nextBoundary) => {
    dispatch(smokeToFire(location, nextBoundary))
  },
  removeFire: (location, nextBoundary) => {
    dispatch(removeFire(location, nextBoundary))
  },
  removeSmoke: (location, nextBoundary) => {
    dispatch(removeSmoke(location, nextBoundary))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Danger)
