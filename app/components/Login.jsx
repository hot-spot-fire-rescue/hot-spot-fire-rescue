import React from 'react'

import firebase from 'APP/fire'

const google = new firebase.auth.GoogleAuthProvider()
const facebook = new firebase.auth.FacebookAuthProvider()
const twitter = new firebase.auth.TwitterAuthProvider()
const github = new firebase.auth.GithubAuthProvider()
const email = new firebase.auth.EmailAuthProvider()

export default ({ auth }) => (
  <div>
    <button className='google login'
            onClick={() => auth.signInWithPopup(google)}>Login with Google</button>
    <button className='facebook login' onClick={() => auth.signInWithPopup(facebook)}>Login with Facebook</button>
  </div>
)
