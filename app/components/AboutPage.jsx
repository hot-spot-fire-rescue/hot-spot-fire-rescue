'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

const AboutPage = () => {
  return (
    <div className='about-page'>
      <div className='about-text-box'>
        <div className='about-us-content'>
          <br /><br /><br /><br />
          <h1>THE CREATORS</h1>
          <br />
          <h3>ANA CALABANO</h3>
          <h3>LYNNE JIANG</h3>
          <h3>MARINA HOASHI</h3>
          <h3>JING WANG</h3>
          <br /><br /><br /><br /><br />
          <hr />
          <br /><br />
          <h4>YOU CAN VISIT OUR GITHUB REPOSITORY BELOW</h4>
          <h4>github.com/hot-spot-fire-rescue</h4>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
