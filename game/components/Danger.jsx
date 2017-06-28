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
      open: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }

  handleClick(event) {
    event.preventDefault()
    console.log('here~~~~~')
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
  
  {
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
                <MenuItem primaryText="Change To Smoke" />
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
                <MenuItem primaryText="Change To Fire" />
                <MenuItem primaryText="Extinguish Smoke" />
              </Menu>
            </Popover>
          </div>
        )
      }
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