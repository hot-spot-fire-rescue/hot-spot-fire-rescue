'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

const AboutPage = () => {
  return (
    <div className='welcome-page'>
      <h3>About US</h3>
      <p>xxxxxxxxxxxxxxx</p>
      <h3><Link to="/home" activeClassName="active">ENTER GAME</Link></h3>
    </div>
  )
}

export default AboutPage
