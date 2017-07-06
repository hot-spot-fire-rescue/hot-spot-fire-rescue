'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

const WelcomePage = () => {
  return (
    <div className='homepage-background'>
      <button className='enter-game btn btn-default'>
        <Link to="/home" activeClassName="active">ENTER GAME</Link>
      </button>
    </div>
  )
}

export default WelcomePage
