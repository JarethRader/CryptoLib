import React, { Component } from 'react';
import '../App.css';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  NavLink,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Cryptolib_Icon from '../features/resources/Cryptolib_Icon.webp';

class NavBar extends Component {
  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <div>
        <Navbar expand='sm' className='navBar' fixed='top'>
          <Container>
            <NavbarBrand
              style={{ color: 'white' }}
              to='/'
              className='orbitronFont'>
              <img
                src={Cryptolib_Icon}
                alt='#'
                style={{
                  width: '2rem',
                  marginRight: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '0.2rem',
                }}
              />
              CryptoLib
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className='ml-auto' navbar>
                <NavItem>
                  <NavLink>
                    <Link to='/' className='navBtn orbitronFont'>
                      Home
                    </Link>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink>
                    <Link to='/about' className='navBtn orbitronFont'>
                      About
                    </Link>
                  </NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret className='navBtn orbitronFont'>
                    Catalog
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>
                      <Link to='/catalog' className='dropBtn orbitronFont'>
                        Catalog
                      </Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link to='/dailyShelf' className='dropBtn orbitronFont'>
                        Daily Shelf
                      </Link>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem>
                  <NavLink>
                    <Link to='/user' className='navBtn orbitronFont'>
                      User
                    </Link>
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default NavBar;
