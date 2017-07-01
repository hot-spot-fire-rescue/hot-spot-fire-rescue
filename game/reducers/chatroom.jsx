import firebase from 'APP/fire'
import {List, fromJS} from 'immutable'

// -- // -- // Actions // -- // -- //

const LOAD_MESSAGES = 'LOAD_MESSAGES'
export const loadMessages = messages => ({
  type: LOAD_MESSAGES,
  messages
})

// -- // -- // Reducer // -- // -- //

export default function reducer (messages = {}, action) {
  switch (action.type) {
    case LOAD_MESSAGES:
      return action.messages
    default:
      return messages
  }
}

export const listenForMessages = () => dispatch => {
  const rootRef = firebase.database().ref()
  const messagesRef = rootRef.child('board').child(store.getState().gameName).child('messages')
  messagesRef.limitToLast(24).on('value', snap => {
    dispatch(loadMessages(snap.val()))
  })
}

export const addMessage = message => dispatch => {
  const rootRef = firebase.database().ref()
  const messagesRef = rootRef.child('board').child(store.getState().gameName).child('messages')
  messagesRef.push(message)
}
