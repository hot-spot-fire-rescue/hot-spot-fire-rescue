'use strict'
import React from 'react'
import {Route, IndexRedirect, IndexRoute, Link} from 'react-router'

const RulePage = () => {
  return (
    <div className = 'rule-background'>
      <h1>THIS IS THE RULE OF GAME </h1>
      <p>This is the detail of rules .. pls read before start</p>
      <h1><Link to='/lobby/test'>BACK TO LOBBY</Link></h1>
    </div>
  )
}

export default RulePage
