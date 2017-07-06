import React from 'react'

import firebase from 'APP/fire'

const google = new firebase.auth.GoogleAuthProvider()

export default ({ auth }) => (

  <div>
    <button className='google login'
        onClick={() => auth.signInWithPopup(google)}>Login with Google</button>
  </div>
)
