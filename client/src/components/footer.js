import React, { Component } from "react";
import "../App.css";
import { Row, Col } from "reactstrap";
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
      <div className="footer">
        <Row>
          <Col sm="4" className="orbitronFont footerHeader">
            CryptoLib
          </Col>
        </Row>
        <Row>
          <Col sm="4">
            <Link className="ftrBtn" to="/">
              Home
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm="4">
            <Link className="ftrBtn" to="/about">
              About
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm="4">
            <Link className="ftrBtn" to="/catalog">
              Catalog
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm="4">
            <Link className="ftrBtn" to="/user">
              User
            </Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <small>&copy; Copyright {currentYear}, CryptoLib</small>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Footer;
