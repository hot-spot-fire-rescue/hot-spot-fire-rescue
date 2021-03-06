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
          <h3 className='game-title'><Link to="/home" activeClassName="active" style={{color: 'rgb(255, 187, 51)'}}>HOT SPOT</Link></h3>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavItem className='navItem' eventKey={1} ><Link to="/rules" className='nav-link' activeClassName="active">Game Rules</Link></NavItem>
          <NavItem className='navItem' eventKey={2} ><Link to="/lobby" className='nav-link' activeClassName="active">Lobby</Link></NavItem>
          <NavItem className='navItem' eventKey={3} ><Link to="/aboutus" className='nav-link' activeClassName="active">About Us</Link></NavItem>
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
