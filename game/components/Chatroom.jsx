'use strict'
import React from 'react'
import {connect} from 'react-redux'
import {addMessage} from '../reducers/message'
import MobileTearSheet from 'material-ui/MobileTearSheet'
import Avatar from 'material-ui/Avatar'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble'
import TextField from 'material-ui/TextField'

export function Chatroom(props) {
  let messages = props.messages
  let username = props.username
  let warning = props.warning
  let handleChange = props.handleChange
  let handleSubmit = props.handleSubmit
  let text = props.text
  let formTitle = props.formTitle

  return (
    <div>
      <form className= 'form-horizontal' onSubmit = {handleSubmit}>
        <fieldset>
          <legend>{formTitle}</legend>
          {warning && <div className = 'alert alert-warning'>{warning}</div>}
          <div className='form-group'>
            <TextField
              hintText = 'Type your message here'
              multiLine={true}
              value = {text}
              onChange = {handleChange}
            /><br />
          </div>
        </fieldset>
      </form>
    </div>
    )
}

// -- // -- // Container // -- // -- //

const mapStateToProps = (state, ownProps) => ({
  messages: state.message,
  username: ownProps.username
})

const mapDispatchToProps = dispatch => ({
  addMessage: (username, text) => {
    dispatch(addMessage(username, text))
  }
})

class ChatroomContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      dirty: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(evt) {
    evt.preventDefault()
    let text = evt.target.value
    this.setState({
      text: text,
      dirty: true
    })
  }

  handleSubmit(evt) {
    evt.preventDefault()
    this.props.addMessage(this.props.username, this.state.text)
    this.setState({
      text: '',
      dirty: false
    })
  }

  render() {
    let messages = this.props.messages
    let username = this.props.username
    let text = this.state.text
    let dirty = this.state.dirty
    let warning = ''

    return (
      <Chatroom
        messages = {messages}
        username = {username}
        text = {text}
        warning = {warning}
        handleSubmit = {this.handleSubmit}
        handleChange = {this.handleChange}
        formTitle = 'Chat'
      />
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatroomContainer)