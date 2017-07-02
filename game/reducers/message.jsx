import {List, fromJS} from 'immutable'

// -- // -- // Actions // -- // -- //

export const LOAD_MESSAGES = 'LOAD_MESSAGES'
export const loadMessages = messages => ({
  type: LOAD_MESSAGES,
  messages
})

export const ADD_MESSAGE = 'ADD_MESSAGE'
export const addMessage = (userName, text) => {
  return ({
    type: ADD_MESSAGE,
    userName,
    text
  })
}

// -- // -- // State // -- // -- //

const initial = List()

// -- // -- // Reducer // -- // -- //

const messageReducer = (state = initial, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return state.set(action.userUame, fromJs({
        user: action.userName,
        text: action.text
      }))
  }
  return state
}

export default messageReducer