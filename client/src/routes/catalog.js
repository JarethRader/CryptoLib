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
import BeatLoader from "react-spinners/BeatLoader";
import { override, shelf } from "../features/utils/override";

export class Catalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      catalogData: [],
      startIndex: 0,
      endIndex: 50,
      scrolling: false
    };
  }

  async componentWillMount() {
    await this.loadCatalog();
    this.setState({ catalogData: this.props.library });
    // this.scrollListener = window.addEventListener("scroll", e => {
    //   this.handleScroll(e);
    // });
  }

  // handleScroll = async e => {
  //   const { scrolling, endIndex } = this.state;
  //   if (scrolling) return;
  //   try {
  //     await getBook(endIndex + 1);
  //   } catch (err) {
  //     return;
  //   }
  //   const lastLi = document.querySelector("div.catalogRow > div.0");
  //   const lastLiOffset = lastLi.offsetTop + lastLi.clientHeight;
  //   const pageOffset = window.pafeYOffset + window.innerHeight;
  //   var bottomOffset = 20;
  //   if (pageOffset > lastLiOffset - bottomOffset) {
  //     this.setState({ endIndex: this.state.endIndex + 1 });
  //     await this.loadCatalog();
  //   }
  // };

  async componentWillUnmount() {
    try {
      await this.props.clearShelf();
      this.setState({ catalogData: {} });
    } catch (err) {
      // console.log(err)
    }
  }

  loadCatalog = async () => {
    let i = this.state.startIndex;
    await getBook(i).then(async book => {
      try {
        // while (i < this.state.endIndex) {
        await this.props.shelveBook(book);
        while (this.props.book.found === true) {
          i++;
          await getBook(i).then(nextBook => {
            try {
              this.props.shelveBook(nextBook);
            } catch (err) {
              // console.log(err)
            }
          });
        }
        // }
        this.setState({ startIndex: this.state.endIndex + 1 });
      } catch (err) {
        // console.log(err)
      }
    });
    this.setState({ catalogData: this.props.library });
    try {
      this.props.libraryLoaded();
    } catch (err) {
      // console.log(err)
    }
  };

  render() {
    const { catalogData } = this.state;
    let rows = catalogData.map((book, index) => (
      <CatalogRow
        key={index}
        catalogData={book}
        checkout={this.props.checkout}
        bookId={book.id}
        userAddress={this.props.userAddress}
        checkingOut={this.props.checkingOut}
      />
    ));
    return (
      <div className="pageBody">
        <div className="catalog">
          <div className="shelf">{rows}</div>
          {this.props.isLoading ? (
            <BeatLoader
              css={override}
              sizeUnit={"rem"}
              size={2}
              color={"#0a960c"}
              loading={this.props.isLoading}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

class CatalogRow extends Catalog {
  state = {
    checkedOut: false
  };
  handleOnClick = async e => {
    // TODO: add payment from user to contract owner before initiating book transfer
    // -> https://davekiss.com/ethereum-web3-node-tutorial/
    handleOnClick = async e => {
    // TODO: add payment from user to contract owner before initiating book transfer
    // -> https://davekiss.com/ethereum-web3-node-tutorial/
    try {
      await this.props.checkout(this.props.bookId, this.props.userAddress);
      this.setState({ checkedOut: true });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { catalogData } = this.props;
    return (
      <Row className={`catalogRow ${this.props.bookId}`}>
        <Col className="catalogCol">{catalogData.title}</Col>
        <Col className="catalogCol">{catalogData.author}</Col>

        {catalogData.available ? (
          <Col className="catalogCol">
            <b>available</b>
          </Col>
        ) : (
          <Col className="catalogCol">
            <b>Checked Out</b>
          </Col>
        )}

        {catalogData.available || this.state.checkedOut === true ? (
          <Col className="catalogCol">
            {this.props.checkingOut.checkoutLoading &&
            this.props.checkingOut.bookID === this.props.bookId ? (
              <BeatLoader
                css={shelf}
                sizeUnit={"rem"}
                size={1}
                color={"#0a960c"}
                loading={this.props.checkingOut}
              />
            ) : (
              <Button
                className="checkoutBtn"
                onClick={e => this.handleOnClick(e)}
              >
                Checkout
              </Button>
            )}
          </Col>
        ) : null}
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  userAddress: state.user.userAddress,
  book: state.library.shelvingBook,
  library: state.library.library,
  loaded: state.library.loadingDone,
  isLoading: state.library.libraryLoading,
  checkingOut: state.library.checkingOut
});

export default connect(mapStateToProps, {
  shelveBook,
  libraryLoaded,
  clearShelf,
  checkout
})(Catalog);
