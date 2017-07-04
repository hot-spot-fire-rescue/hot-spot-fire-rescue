'use strict'
import React from 'react'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

const customContentStyle = {
  // width: '100%',
  // maxWidth: 'none',
  backgroundImage: "url('/images/board.jpg')",
}

export class GameEnd extends React.Component {
  state = {
    open: true,
  }

  handleOpen = () => {
    this.setState({open: true})
  }

  handleClose = () => {
    this.setState({open: false})
  }

  render() {
    const actions = [
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ]

    return (
      <div>
        <Dialog
          title={this.props.info[0]}
          actions={actions}
          modal={true}
          contentStyle={customContentStyle}
          open={this.state.open}
          style={{backgroundImage:"url('/images/board.jpg')" }}
        >
          {this.props.info[1]}
        </Dialog>
      </div>
    )
  }
}

// -- // -- // Container // -- // -- //

const mapStateToProps = (state, ownProps) => ({
  info: ownProps.info
})
//info is supposed to be an array like this: 
//['YOU WON', 'Great job! You rescued 7 victims from the burning buliding'] or ['GAME OVER', 'The building collapsed'] or ['GAME OVER', '4 victims were lost']

export default connect(mapStateToProps)(GameEnd)
