'use strict'
import React from 'react'
import {connect} from 'react-redux'
import {fireToSmoke, smokeToFire, removeFire, removeSmoke} from '../reducers/danger'
import {sortCoord} from '../reducers/boundary'
import RaisedButton from 'material-ui/RaisedButton'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'

class Danger extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      open: false
    }
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

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
          
          <img src='/images/fire.gif' className='fire' onTouchTap = {this.handleTouchTap}/>}
          
          <Popover 
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <MenuItem primaryText="Change To Smoke" onTouchTap={() => fireToSmoke(location, nextBoundary)}/>
            <MenuItem primaryText="Extinguish Fire" onTouchTap={() => removeFire(location, nextBoundary)}/>
          </Menu>
        </Popover>
      </div>
      )
    } else if (kind === 'smoke' && status === 1) {
      return (
        <div>
          <img src='/images/smoke.gif' className={'fire smoke'} onTouchTap = {this.handleTouchTap}/>
          <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <MenuItem primaryText="Change To Fire" onTouchTap={() => smokeToFire(location, nextBoundary)}/>
            <MenuItem primaryText="Extinguish Smoke" onTouchTap={() => removeSmoke(location, nextBoundary)}/>
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
