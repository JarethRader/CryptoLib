import React, { Component } from "react";
import "../App.css";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

export class Footer extends Component {
  constructor(props) {
    super(props);

    let d = new Date();
    let currentYear = d.getFullYear();
    this.state = { currentYear };
  }

  render() {
    const { currentYear } = this.state;
    return (
      <Container className="footer">
        <Row>
          <Col sm="4" className="orbitronFont footerHeader">
            CryptoLib
          </Col>
        </Row>
        <Row>
          <Col sm="4">
            <Link className="ftrBtn orbitronFont" to="/">
              Home
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm="4">
            <Link className="ftrBtn orbitronFont" to="/about">
              About
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm="4">
            <Link className="ftrBtn orbitronFont" to="/catalog">
              Catalog
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm="4">
            <Link className="ftrBtn orbitronFont" to="/user">
              User
            </Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <small>&copy; Copyright {currentYear}, CryptoLib</small>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Footer;
