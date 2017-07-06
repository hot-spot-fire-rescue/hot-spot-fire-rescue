'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

const WelcomePage = () => {
  return (
    <div className='homepage-background'>
      <div class='welcome-enter-btn-wrapper'>
        <button className='welcome-enter-game btn btn-warning' type="submit" value="enter">
          <Link to="/home" activeClassName="active">ENTER GAME</Link>
        </button>
      </div>
    </div>
  )
}

export default WelcomePage
