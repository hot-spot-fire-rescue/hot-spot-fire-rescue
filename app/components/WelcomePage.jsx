'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

import Signin from './Signin'

const WelcomePage = () => {
  return (
    <div className='homepage-background'>
      <button className='enter-game btn btn-default'>
        <Link to="/lobby" activeClassName="active">ENTER GAME</Link>
      </button>
    </div>
  )
}


      //<div class='welcome-enter-btn-wrapper'>
       // <button className='welcome-enter-game btn btn-warning' type="submit" value="enter">
         // <Link to="/home" activeClassName="active">ENTER GAME</Link>
        //</button>
      //</div>

export default WelcomePage
