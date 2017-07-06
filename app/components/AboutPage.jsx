'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

const AboutPage = () => {
  return (
    <div className='about-page'>
      <div className='about-text-box'>
        <div className='about-us-content'>
          <h3>About US</h3>
          <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*</p>
        </div>
      </div>
      <div className='about-enter-game-btn-wrapper'>
        <button className='about-enter-game btn btn-warning' type="submit" value="enter"><Link to="/home" activeClassName="active">ENTER GAME</Link></button>
      </div>
    </div>
  )
}

export default AboutPage
