import React from 'react'

import firebase from 'APP/fire'

const google = new firebase.auth.GoogleAuthProvider()

export default ({ auth }) => (

  <div>
    <button type="button" className='google-login btn btn-warning' type="submit" value="google-login"
        onClick={() => auth.signInWithPopup(google)}>Login with Google</button>
  </div>
)
