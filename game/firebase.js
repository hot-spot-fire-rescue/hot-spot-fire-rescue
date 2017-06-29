'use strict'
// import firebase from 'firebase';
const config = {
  apiKey: 'AIzaSyDH2LzZ1o__5JwmdJuhw0VqY_CIMTeRQ2Y',
  authDomain: 'hot-spot-fire-rescue-7ae18.firebaseapp.com',
  databaseURL: 'https://hot-spot-fire-rescue-7ae18.firebaseio.com',
  projectId: 'hot-spot-fire-rescue-7ae18',
  storageBucket: '',
  messagingSenderId: '1060889978146'
}

const firebase = require("firebase")
require("firebase/auth")
require("firebase/database")
export const fbDB = firebase.database()
export const fbAuth = firebase.auth()

export const googleProvider = new firebase.auth.GoogleAuthProvider()
// googleProvider.addScope('https://www.googleapis.com/auth/plus.login');
export const facebookProvider = new firebase.auth.FacebookAuthProvider()
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // console.log('uid', user.uid)
  }
})

// console.log('fbDB:', fbDB)
// console.log('fbAuth ID:', fbAuth)
// console.log(googleProvider)
// console.log(facebookProvider)
