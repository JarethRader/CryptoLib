import React, { Component } from "react";
import "../App.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container
} from "reactstrap";
import { Link } from "react-router-dom";
import Cryptolib_Icon from "../features/resources/Cryptolib_Icon.png";

class NavBar extends Component {
  state = {
    isOpen: false
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <div>
        <Navbar dark expand="sm" className="navBar" fixed="top">
          <Container>
            <NavbarBrand href="/" className="orbitronFont">
              <img
                src={Cryptolib_Icon}
                alt="#"
                style={{
                  width: "2rem",
                  marginRight: "1rem",
                  backgroundColor: "white",
                  borderRadius: "0.2rem"
                }}
              />
              CryptoLib
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link to="/" className="navBtn">
                    Home
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/about" className="navBtn">
                    About
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/catalog" className="navBtn">
                    Catalog
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/user" className="navBtn">
                    User
                  </Link>
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
