import React from 'react'

import firebase from 'APP/fire'

const google = new firebase.auth.GoogleAuthProvider()
const facebook = new firebase.auth.FacebookAuthProvider()
const twitter = new firebase.auth.TwitterAuthProvider()
const github = new firebase.auth.GithubAuthProvider()
const email = new firebase.auth.EmailAuthProvider()

export default ({ auth }) => (

  // signInWithPopup will try to open a login popup, and if it's blocked, it'll
  // redirect. If you prefer, you can signInWithRedirect, which always
  // redirects.
  <div>
    <button className='google login'
            onClick={() => auth.signInWithPopup(google)}>Login with Google</button>
  {/*<button className='facebook login' onClick={() => auth.signInWithPopup(facebook)}>Login with Facebook</button>*/}
  </div>
)
