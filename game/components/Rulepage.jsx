'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

const RulePage = () => {
  return (
    <div className='rule-background'>
      <h1><Link className ='rule-lobby' to='/lobby/test'>BACK TO LOBBY</Link></h1>
      <div id='gamerule'>
        <h1 className='rulecontent rule-title'>This is the Rules of the game</h1>
        <p className='rulecontent rule-paragraph'>Please read before starting the game !</p>
      </div>
    </div>
  )
}

export default RulePage
