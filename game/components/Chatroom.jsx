'use strict'
import React from 'react'
import {connect} from 'react-redux'
import {addMessage} from '../reducers/message'
import MobileTearSheet from './MobileTearSheet'
import Avatar from 'material-ui/Avatar'
import {List, ListItem} from 'material-ui/List'
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors'
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
      <MobileTearSheet>
        <List>
          <Subheader>Recent chats</Subheader>
          {
            messages && messages.slice(-8).map(message => {
              let key = messages.indexOf(message)
              let messageUsername = messages.getIn([key, 'user'])
              let messageText = messages.getIn([key, 'text'])
              let render = `${messageUsername} : ${messageText}`
            return (
              <div>
                <ListItem
                  leftAvatar={<Avatar src='https://maxcdn.icons8.com/Share/icon/Users//circled_user_female1600.png' />}
                  secondaryText={
                    <p>
                      <span style={{color: darkBlack}}>{messageUsername}</span> -- {messageText}
                    </p>
                  }
                />
                <Divider inset={true} />
              </div>
            )
          })
        }
        </List>
      </MobileTearSheet>
      <div style={{display: 'inline-block'}}>
        <form className= 'form-horizontal' onSubmit = {handleSubmit} style={{display: 'inline-block'}}>
          <fieldset>
            <legend>{formTitle}</legend>
            {warning && <div className = 'alert alert-warning'>{warning}</div>}
            <div className='form-group'>
              <TextField
                hintText = 'Type your message here'
                value = {text}
                onChange = {handleChange}
              /><br />
            </div>
          </fieldset>
        </form>
      </div>
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
        formTitle = 'Chat Room'
      />
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatroomContainer)
