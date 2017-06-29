'use strict'
import React from 'react'
import {connect} from 'react-redux'
import {fireToSmoke, smokeToFire, removeFire, removeSmoke} from '../reducers/danger'
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
      kind,
      location,
      status,
      fireToSmoke,
      smokeToFire,
      removeFire,
      removeSmoke,
    } = this.props
  
      if (kind === 'fire' && status === 1) {
        return (
          <div>
            <div className='fire'
              id={location} style={{backgroundColor: 'red'}} onClick={this.handleClick}/>
            <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
          >
            <Menu>
              <MenuItem primaryText="Change To Smoke" onClick={()=> fireToSmoke(location)}/>
              <MenuItem primaryText="Extinguish Fire" onClick={() => removeFire(location)}/>
            </Menu>
          </Popover>
        </div>
          )
      } else if (kind === 'smoke' && status === 1) {
        return (
          <div>
            <div className='fire'
              id={location} style={{backgroundColor: 'grey'}} onClick={this.handleClick}/>
            <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
          >
            <Menu>
              <MenuItem primaryText="Change To Fire" onClick={()=> smokeToFire(location)}/>
              <MenuItem primaryText="Extinguish Smoke" onClick={() => removeSmoke(location)}/>
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
  location: ownProps.location,
  kind: ownProps.kind,
  status: ownProps.status
})

const mapDispatchToProps = dispatch => ({
  fireToSmoke: (location) => {
    dispatch(fireToSmoke(location))
  },
  smokeToFire: (location) => {
    dispatch(smokeToFire(location))
  },
  removeFire: (location) => {
    dispatch(removeFire(location))
  },
  removeSmoke: (location) => {
    dispatch(removeSmoke(location))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Danger)
