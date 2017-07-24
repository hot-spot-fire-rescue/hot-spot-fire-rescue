'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

const AboutPage = () => {
  return (
    <div className='about-page'>
      <div className='about-text-box'>
        <div className='about-us-content'>
          <h3>VISIT OUR GITHUB REPOSITORY HERE:</h3>
          <h4><a className="link" target="_blank" href="https://github.com/hot-spot-fire-rescue/hot-spot-fire-rescue">github.com/hot-spot-fire-rescue</a></h4>
          <br />
          <hr />
          <br />
          <h1>THE CREATORS</h1>
          <br />
          <h3>ANA CALABANO</h3>
          <h3>LYNNE JIANG</h3>
          <h3>MARINA HOASHI</h3>
          <h3>JING WANG</h3>
          <br />
        </div>
      </div>
    </div>
  )
}

export default AboutPage
