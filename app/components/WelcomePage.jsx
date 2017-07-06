'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

const WelcomePage = () => {
  return (
    <div className='welcome-page'>
      <button className='enter-game btn btn-warning btn-defaut'><Link to="/home" activeClassName="active">ENTER GAME</Link></button>
    </div>
  )
}

export default WelcomePage
