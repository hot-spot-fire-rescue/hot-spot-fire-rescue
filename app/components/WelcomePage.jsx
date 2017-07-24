'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

import Signin from './Signin'

const WelcomePage = () => {
  return (
    <div className='homepage-background'>
      <button className='enter-game btn btn-default'>
        <Link to="/lobby/1" activeClassName="active">ENTER GAME</Link>
      </button>
    </div>
  )
}

export default WelcomePage
