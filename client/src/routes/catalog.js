import React, { Component } from "react";
import { Container, Button } from "reactstrap";
import { connect } from "react-redux";
import { mintNewBook } from "../actions/libraryActions";

export class Catalog extends Component {
  handleClick = e => {
    // e.preventDefault();
    // this.props.mintNewBook(
    //   this.props.userAccount,
    //   "The Adventures of Tom Sawyer",
    //   "Mark Twain",
    //   "Qmf6h71A5ddDx6PjLj1vQjDxjhWp1GetpAE3KGALxeQVmh"
    // );
  };

  render() {
    return (
      <Container className="pageBody">
        <h1>Catalog</h1>
        <Button onClick={e => this.handleClick(e)}>One clicky boi</Button>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  userAccount: state.user.userAccount
});

export default connect(mapStateToProps, { mintNewBook })(Catalog);
