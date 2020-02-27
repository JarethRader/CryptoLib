import React, { Component } from "react";
import axios from "axios";
import PDFViewer from "../features/PDFViewer";
import PDFJSBackend from "../features/pdfBackend/pdfjs";
import { Container, Row, Col, Button } from "reactstrap";
import getBook from "../features/utils/getBook";
import BeatLoader from "react-spinners/BeatLoader";
import { override } from "../features/utils/override";
import { Helmet } from "react-helmet";

export class DailyShelf extends Component {
  state = {
    shelf: [],
    shelfPopulated: false,
    selectedBook: null,
    selectedID: null,
    showSelected: false,
    width: window.innerWidth
  };

  async componentDidMount() {
    if (this.state.shelf.length === 0) {
      await this.getDailyShelf()
        .then(list => {
          this.setState({ shelf: list }, () => {
            this.setState({ shelfPopulated: true });
          });
          return;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  getDailyShelf = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let bookList = [];
        await axios
          .get("/library/dailyShelf")
          .then(async shelf => {
            for (let i = 0; i < shelf.data.shelf.shelfList.length; i++) {
              await getBook(shelf.data.shelf.shelfList[i]).then(book => {
                bookList.push(book);
              });
            }
            resolve(bookList);
          })
          .catch(err => {
            throw err;
          });
      } catch (err) {
        reject(err);
      }
    });
  };

  setSelected = book => {
    this.setState({ selectedID: book.id });
    let bookHash = book.hash;
    let address =
      "https://ipfs.infura.io/ipfs/" + bookHash + "#toolbar=0&navpanes=0";
    this.setState({ selectedBook: address }, () => {
      this.setState({ showSelected: true });
    });
  };

  render() {
    let rows = this.state.shelf.map((book, bookID) => (
      <ShelfRow
        key={bookID}
        book={book}
        selectedID={this.state.selectedID}
        setSelected={this.setSelected}
      />
    ));
    const isMobile = this.state.width <= 500;
    return (
      <div className="dailyShelf">
        <Helmet>
          <meta charSet="utf-8" />
          <meta
            name="Daily Shelf"
            content="Daily shelf selection for Cryptolib"
          />
          <title>CryptoLib - Daily Shelf</title>
          <link rel="canonical" href="https://cryptolib.co/dailyShelf" />
        </Helmet>
        <Container>
          <h1>Today's Shelf</h1>
          {this.state.shelfPopulated ? (
            <div>{rows}</div>
          ) : (
            <BeatLoader
              css={override}
              sizeUnit={"rem"}
              size={2}
              color={"#0a960c"}
              loading={!this.state.shelfPopulated}
            />
          )}
        </Container>
        <hr className="my-2" />
        <div>
          {this.state.showSelected ? (
            <div>
              {isMobile === true ? (
                <Container style={{ height: "45rem" }}>
                  <PDFViewer
                    backend={PDFJSBackend}
                    src={this.state.selectedBook}
                  />
                </Container>
              ) : (
                <Container style={{ height: "60rem" }}>
                  <PDFViewer
                    backend={PDFJSBackend}
                    src={this.state.selectedBook}
                  />
                </Container>
              )}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

class ShelfRow extends DailyShelf {
  handleSelect = async e => {
    e.preventDefault();
    this.props.setSelected(this.props.book);
  };

  render() {
    const { book, selectedID } = this.props;
    return (
      <Row className="catalogRow">
        <Col className="catalogCol">{book.title}</Col>
        <Col className="catalogCol">{book.author}</Col>
        <Col className="catalogCol">
          {selectedID === book.id ? (
            <b>Selected</b>
          ) : (
            <Button className="checkoutBtn" onClick={e => this.handleSelect(e)}>
              Select Book
            </Button>
          )}
        </Col>
      </Row>
    );
  }
}

export default DailyShelf;
