'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

const AboutPage = () => {
  return (
    <div className='welcome-page'>
      <h3>About US</h3>
      <p>xxxxxxxxxxxxxxx</p>
      <button className='about-enter-game btn btn-warning' type="submit" value="enter"><Link to="/home" activeClassName="active">ENTER GAME</Link></button>
    </div>
  )
}

export default AboutPage
