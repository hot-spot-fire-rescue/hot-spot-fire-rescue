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
      <MobileTearSheet style={{borderRadius: '20px'}}>
        <List style={{backgroundColor: 'rgba(85, 107, 47, 0.8)', borderRadius: '20px'}}>
          <Subheader style={{color: 'black'}}>Recent Messages</Subheader>
          {
            messages && messages.slice(-6).map(message => {
              let key = messages.indexOf(message)
              let messageUsername = messages.getIn([key, 'user'])
              let messageText = messages.getIn([key, 'text'])
              let render = `${messageUsername} : ${messageText}`
              return (
                <div>
                  <ListItem
                    secondaryText={
                      <p>
                        <span style={{color: darkBlack}}>{messageUsername}</span> -- {messageText}
                      </p>
                    }
                    secondaryTextLines={2}
                  />
                  <Divider inset={true} />
                </div>
              )
            }
          )
        }
        </List>
      </MobileTearSheet>
        <form onSubmit = {handleSubmit } style={{color: 'black'}}>
          <fieldset>
            <div className='form-group' style= {{backgroundColor: 'snow', opacity: '0.5', textAligment: 'center', borderRadius: '20px'}}>
             <TextField
                hintText = 'Type your message here'
                value = {text}
                onChange = {handleChange}
              />
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
        formTitle = '  Chat Room'
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatroomContainer)
