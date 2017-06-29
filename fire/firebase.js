'use strict'
const firebase = require('APP/fire/index')
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
