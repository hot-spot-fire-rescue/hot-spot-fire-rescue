import firebase from 'APP/fire'

const LOAD_MESSAGES = 'LOAD_MESSAGES'
export const loadMessages = messages => ({
  type: LOAD_MESSAGES,
  messages
})

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
  const messagesRef = rootRef.child('games').child(store.getState().gameId).child('messages')
  messagesRef.limitToLast(24).on('value', snap => {
    dispatch(loadMessages(snap.val()))
  })
}

export const addMessage = message => dispatch => {
  const rootRef = firebase.database().ref()
  const messagesRef = rootRef.child('games').child(store.getState().gameId).child('messages')
  messagesRef.push(message)
}
