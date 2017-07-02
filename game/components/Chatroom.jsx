import React from 'react'
import ReactDom from 'react-dom'
import {connect} from 'react-redux'
import {listenForMessages, addMessage} from '../reducers/chatroom'

export class Chatroom extends React.Component {
  constructor(props) {
    super(props)
    this.saveMessage = this.saveMessage.bind(this)
  }
  componentDidMound() {
    this.props.fireRef.once('value', (snapshot) => {
      if (!snapshot.exists()) this.props.listenForMessages(this.props.gameId)
    }) 
  }
  componentDidUpdate() {
    this.scrollToBottom()
  }
  scrollToBottom() {
    const {messageList} = this.props.fireRef
    const scrollHeight = messageList.scrollHeight
    const height = messageList.clientHeight
    const maxScrollTop = scrollHeight - height
    ReactDom.findDOMNode(messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
  }

  saveMessage(event) {
    event.preventDefault()
    console.log(this.props.loggedInUser)
    // let name = this.props.loggedInUser.displayName.split(' ')
    const message = {
      // name: `${name[0]} ${name[1]}`,
      text: event.target.text.value
    }
    this.props.addMessage(this.props.gameId, message)
    event.target.text.value = null
  }

  render(){
    const messages = this.props.messages
    return (
      <div className="mdl-shadow--2dp chatroom">
        <div id="message-container" ref="messageList">
          {messages && Object.keys(messages).map(k => messages[k]).map( (message, idx) =>
              <div className="messages" key = {idx}>{/*<strong>{message.name}</strong>:*/} {message.text}</div>
            )}
        </div>
        <form id="message-form" action="#" onSubmit={this.saveMessage} >
          <div id="message-input" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style={{background:'white', opacity: '0.9', borderRadius: '5px'}}>
            <input className="mdl-textfield__input" type="text" id="message" name="text" />
            <label className="mdl-textfield__label" htmlFor="message">Type Message Here...</label>
          </div>
        </form>
      </div>
      )
  }
}

// -- // -- // Container // -- // -- //

const mapState = ({ messages }) => ({ messages})

const mapDispatch = { listenForMessages, addMessage }

export default connect(mapState, mapDispatch)(Chatroom)

