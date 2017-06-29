const firebase = require('firebase')

// -- // -- // -- // Firebase Config // -- // -- // -- //

export const config = {
  apiKey: 'AIzaSyDH2LzZ1o__5JwmdJuhw0VqY_CIMTeRQ2Y',
  authDomain: 'hot-spot-fire-rescue-7ae18.firebaseapp.com',
  databaseURL: 'https://hot-spot-fire-rescue-7ae18.firebaseio.com',
  projectId: 'hot-spot-fire-rescue-7ae18',
  storageBucket: '',
  messagingSenderId: '1060889978146'
}

// -- // -- // -- // -- // -- // -- // -- // -- // -- //

// Initialize the app, but make sure to do it only once.
//   (We need this for the tests. The test runner busts the require
//   cache when in watch mode; this will cause us to evaluate this
//   file multiple times. Without this protection, we would try to
//   initialize the app again, which causes Firebase to throw.
//
//   This is why global state makes a sad panda.)
firebase.__bonesApp || (firebase.__bonesApp = firebase.initializeApp(config))

module.exports = firebase
