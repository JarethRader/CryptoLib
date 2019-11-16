import React, { Component } from "react";
import { Container, Button } from "reactstrap";

export class Catalog extends Component {
  handleClick = e => {};

  render() {
    return (
      <Container className="pageBody">
        <h1>Catalog</h1>
        <Button onClick={e => this.handleClick(e)}>One clicky boi</Button>
      </Container>
    );
  }
}

export default Catalog;
