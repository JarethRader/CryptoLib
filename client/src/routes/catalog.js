import React, { Component } from "react";
import "./route.css";
import { Button, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import {
  shelveBook,
  libraryLoaded,
  clearShelf,
  checkout
} from "../actions/libraryActions";
import getBook from "../features/utils/getBook";
import { css } from "@emotion/core";
// Another way to import. This is recommended to reduce bundle size
import BeatLoader from "react-spinners/BeatLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  padding-top: 10rem;
`;

export class Catalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      catalogData: [],
      startIndex: 0,
      endIndex: 20
    };
  }

  async componentDidMount() {
    console.log("Loading catalog");
    await this.loadCatalog();
    this.setState({ catalogData: this.props.library });
  }

  //TODO clear library props data on unmount, and reload on page remount
  async componentWillUnmount() {
    try {
      await this.props.clearShelf();
      this.setState({ catalogData: {} });
    } catch (err) {
      console.log(err);
    }
  }

  loadCatalog = async () => {
    console.log("Start Loading");
    let i = 0;
    await getBook(i).then(async book => {
      console.log(book);
      try {
        await this.props.shelveBook(book);
        console.log(this.props.book);
        while (this.props.book.found === true) {
          i++;
          await getBook(i).then(nextBook => {
            try {
              this.props.shelveBook(nextBook);
              console.log(this.props.book.book);
            } catch (err) {
              console.log(err);
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
    this.setState({ catalogData: this.props.library });
    try {
      this.props.libraryLoaded();
    } catch (err) {
      console.log(err);
    }
  };

  handleOnClick = index => {
    try {
      this.props.checkout(index);
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { catalogData } = this.state;
    let rows = catalogData.map((book, index) => (
      <CatalogRow
        key={book.id}
        catalogData={book}
        handleOnClick={this.handleCheckoutBtn}
        index={index}
      />
    ));
    return (
      <div className="pageBody catalog">
        {this.props.isLoading ? (
          <BeatLoader
            css={override}
            sizeUnit={"rem"}
            size={2}
            color={"#0a960c"}
            loading={this.props.isLoading}
          />
        ) : (
          <div>{rows}</div>
        )}
      </div>
    );
  }
}

class CatalogRow extends Catalog {
  render() {
    const { index, handleOnClick } = this.props;
    console.log(index);
    return (
      <Row className="catalogRow">
        <Col className="catalogCol">{this.props.catalogData.title}</Col>
        <Col className="catalogCol">{this.props.catalogData.author}</Col>

        {this.props.catalogData.available ? (
          <Col className="catalogCol">
            <b>available</b>
          </Col>
        ) : (
          <Col className="catalogCol">
            <b>Checked Out</b>
          </Col>
        )}

        {this.props.catalogData.available ? (
          <Col className="catalogCol">
            <Button
              className="checkoutBtn"
              onClick={() => handleOnClick(index)}
            >
              Checkout
            </Button>
          </Col>
        ) : null}
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  userAccount: state.user.userAccount,
  book: state.library.shelvingBook,
  library: state.library.library,
  loaded: state.library.loadingDone,
  isLoading: state.library.libraryLoading
});

export default connect(mapStateToProps, {
  shelveBook,
  libraryLoaded,
  clearShelf,
  checkout
})(Catalog);
