import React from 'react'
import ReactDom from 'react-dom'

export class Chatroom extends React.Component {
  constructor(props) {
    super(props)
    this.saveMessage = this.saveMessage.bind(this)
  }
  componentDidMound() {
    this.props.listenForMessages()
  }
  componentDidUpdate() {
    this.scrollToBottom()
  }
  scrollToBottom() {
    const {messageList} = this.refs
    const scrollHeight = messageList.scrollHeight
    const height = messageList.clientHeight
    const maxScrollTop = scrollHeight - height
    ReactDom.findDOMNode(messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
  }

  saveMessage(event) {
    event.preventDefault()
    let name = this.props.loggedInUser.displayName.split(' ')
    const message = {
      name: `${name[0]} ${name[1]}`,
      text: event.target.text.value
    }
    this.props.addMessage(message)
    event.target.text.value = null
  }

  render(){
    const messages = this.props.messages
    return (
      
      )
  }
}