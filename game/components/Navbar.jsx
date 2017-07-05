import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Login from 'APP/app/components/Login'
import WhoAmI from 'APP/app/components/WhoAmI'
import { NavItem, Navbar, Nav } from 'react-bootstrap'

/* -----------------    COMPONENT     ------------------ */

const NavbarComp = ({ auth }) => {
  return (
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <h3 >HOT SPOT</h3>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavItem eventKey={1} >Home</NavItem>
          <NavItem eventKey={2} >Game Rules</NavItem>
          <NavItem eventKey={1} >Lobby</NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem>
            <div className="login-navbar">
              <WhoAmI auth={auth} />
            </div>
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavbarComp
