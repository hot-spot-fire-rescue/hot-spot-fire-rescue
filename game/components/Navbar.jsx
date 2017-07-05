import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Login from './Login'
import WhoAmI from './WhoAmI'

/* -----------------    COMPONENT     ------------------ */

const Navbar = () => {
  return (
    <nav className="navbar navbar-default">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target=".navbar-collapse">
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <Link className="navbar-brand" to="/">Home</Link>
        </div>
        <div className="collapse navbar-collapse">
          <ul className="nav navbar-nav">
            <li>
              <Link to="/lobby/test" activeClassName="active">Lobby</Link>
            </li>
            <li>
              <Link to="/rules" activeClassName="active">Game Rules</Link>
            </li>
          </ul>
          {/*<div className="login-navbar">
            {user ? <WhoAmI/> : <Login/>}
          </div>*/}
        </div>
      </div>
    </nav>
  )
}
