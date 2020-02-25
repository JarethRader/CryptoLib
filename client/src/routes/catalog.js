import React, { Component } from "react";
import "./route.css";
import { Helmet } from "react-helmet";
import {
  Button,
  ButtonGroup,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input
} from "reactstrap";
import { connect } from "react-redux";
import {
  shelveBook,
  libraryLoaded,
  clearShelf,
  checkout
} from "../actions/libraryActions";
import { returnErrors } from "../actions/errorActions";
import getBook from "../features/utils/getBook";
import BeatLoader from "react-spinners/BeatLoader";
import { override, shelf } from "../features/utils/override";
import axios from "axios";

export class Catalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      catalogData: [],
      startIndex: 0,
      endIndex: 20,
      shelfList: [],
      libraryLength: 0,
      query: null
    };
  }

  async componentDidMount() {
    this.getLibraryLength();
    await this.updateCatalog();
  }

  //TODO clear library props data on unmount, and reload on page remount
  async componentWillUnmount() {
    if (this.props.library) {
      this.props.clearShelf();
      this.setState({ catalogData: {} });
    }
  }

  updateCatalog = async () => {
    if (this.props.library) {
      await this.props.clearShelf();
    }
    await this.setShelfList()
      .then(async () => {
        await this.loadCatalog()
          .then(async () => {
            this.setState({ catalogData: this.props.library });
            try {
              await this.props.libraryLoaded();
            } catch (err) {
              throw err;
            }
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        // this.props.returnErrors(err.message, 500);
      });
  };

  getLibraryLength = async () => {
    let len =
      (
        await axios({
          url: "/library/lastIndex",
          method: "get",
          baseURL: "http://localhost:8000"
        })
      ).data.data - 1;
    this.setState({ libraryLength: len });
  };

  setShelfList = () => {
    return new Promise((resolve, reject) => {
      let tmpList = [];
      try {
        for (let i = this.state.startIndex; i <= this.state.endIndex; i++) {
          tmpList.push(i);
        }
        this.setState({ shelfList: tmpList }, () => {
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  loadCatalog = async () => {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i <= this.state.shelfList.length - 1; i++) {
        try {
          await getBook(this.state.shelfList[i]).then(async book => {
            await this.props.shelveBook(book);
          });
        } catch (err) {
          reject(err);
        }
      }
      this.setState({ catalogData: this.props.library });
      resolve();
    });
  };

  handleBackClick = async () => {
    let tmpIndex =
      this.state.startIndex - 20 < 0 ? 0 : this.state.startIndex - 20;
    this.setState({ startIndex: tmpIndex });
    this.setState({ endIndex: tmpIndex + 20 });
    await this.updateCatalog();
  };

  handleForwardClick = async () => {
    let tmpIndex = this.state.endIndex;
    this.setState({ startIndex: tmpIndex + 1 });
    tmpIndex =
      tmpIndex + 20 > this.state.libraryLength
        ? this.state.libraryLength
        : tmpIndex + 20;
    this.setState({ endIndex: tmpIndex });
    await this.updateCatalog();
  };

  onChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  handleQuery = async e => {
    e.preventDefault();
    if (this.state.query === null || this.state.query === "") {
      return;
    }
    let queryShelf = await axios({
      url: `/library/search?search=${this.state.query}`,
      method: "get",
      baseURL: "http://localhost:8000"
    });
    this.setState({ shelfList: queryShelf.data }, async () => {
      this.props.clearShelf();
      await this.loadCatalog()
        .then(async () => {
          this.setState({ catalogData: this.props.library });
          await this.props.libraryLoaded();
        })
        .catch(err => {});
    });
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
        updateCatalog={this.updateCatalog}
        clearShelf={this.props.clearShelf}
      />
    ));
    return (
      <div className="pageBody">
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="Catalog" content="Catalog page for cryptolib" />
          <title>CryptoLib - Catalog</title>
          <link rel="canonical" href="https://cryptolib.co/catalog" />
        </Helmet>
        <div className="catalogHeader">
          <InputGroup className="searchBar">
            <Button
              color="secondary"
              style={{
                marginRight: "5%",
                paddingLeft: "5%",
                paddingRight: "5%"
              }}
              onClick={this.updateCatalog}
            >
              Latest
            </Button>
            <Input
              style={{ borderRadius: "5px" }}
              type="search"
              name="query"
              onChange={e => this.onChange(e)}
            />
            <InputGroupAddon addonType="append">
              <Button color="secondary" onClick={e => this.handleQuery(e)}>
                Search
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <br />
        </div>
        <div className="catalog">
          <div>
            <Row className="tableHeader" style={{ borderRadius: "0px" }}>
              <Col className="catalogCol">Title</Col>
              <Col className="catalogCol">Author(s)</Col>
              <Col className="catalogCol">Availablity</Col>
              <Col className="catalogCol">Checkout</Col>
            </Row>
          </div>
          <hr className="my-auto" />
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
        <hr className="my-1" />
        <div className="mb-2 mt-2">
          <ButtonGroup className="catalogNavBtns">
            {this.state.startIndex === 0 ? null : (
              <Button
                color="secondary"
                className="catalogBtn"
                onClick={this.handleBackClick}
              >
                <b>&larr;</b>
              </Button>
            )}
            {this.state.shelfList.length < 20 ? null : (
              <Button
                color="secondary"
                className="catalogBtn"
                onClick={this.handleForwardClick}
              >
                <b>&rarr;</b>
              </Button>
            )}
          </ButtonGroup>
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
    await this.props.checkout(this.props.bookId, this.props.userAddress);
    // await this.props.updateCatalog();
    this.setState({ checkedOut: true });
  };

  render() {
    const { catalogData } = this.props;
    return (
      <Row className="catalogRow">
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
                color="secondary"
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
  checkout,
  returnErrors
})(Catalog);
