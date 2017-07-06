import React from 'react'
import {PanelGroup, Panel} from 'react-bootstrap'
import {browserHistory} from 'react-router'

import firebase from 'APP/fire'
const auth = firebase.auth()

import PlainLogin from 'APP/app/components/PlainLogin'
import Login from './Login'

export const name = user => {
  if (!user) return 'Nobody'
  if (user.isAnonymous) return 'Anonymous'
  return user.displayName || user.email
}

export const WhoAmI = ({user, auth}) =>
  <div className="whoami">
    {
      (!user || user.isAnonymous)?
      <div>
        <div className = 'google-oauth'>
          <Login auth={auth}/>
        </div>
      </div>
      : <button className='logout' onClick={() => {
        browserHistory.push('/home')
        return auth.signOut()
      }}>Logout</button> }
  </div>

export default class extends React.Component {
  componentDidMount() {
    const {auth} = this.props
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {user} = this.state || {}
    return <WhoAmI user={user} auth={auth}/>
  }
}
