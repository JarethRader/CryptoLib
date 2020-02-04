import React, { Component } from "react";
import axios from "axios";
import PDFViewer from "../features/PDFViewer";
import PDFJSBackend from "../features/pdfBackend/pdfjs";
import { Container, Row, Col, Button } from "reactstrap";
import getBook from "../features/utils/getBook";
import BeatLoader from "react-spinners/BeatLoader";
import { override } from "../features/utils/override";

export class DailyShelf extends Component {
  state = {
    shelf: [],
    shelfPopulated: false,
    selectedBook: null,
    showSelected: false
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

  getDailyShelf = async () => {
    return new Promise(async (resolve, reject) => {
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
          console.log(err);
          reject(err);
        });
    });
  };

  setSelected = book => {
    let bookHash = book.hash;
    let address =
      "https://ipfs.infura.io/ipfs/" + bookHash + "#toolbar=0&navpanes=0";
    console.log(address);
    this.setState({ selectedBook: address }, () => {
      this.setState({ showSelected: true });
    });
  };

  render() {
    let rows = this.state.shelf.map((book, bookID) => (
      <ShelfRow key={bookID} book={book} setSelected={this.setSelected} />
    ));
    return (
      <div
        style={{ marginTop: "10%", marginBottom: "5%", textAlign: "center" }}
      >
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
            <Container style={{ height: "1000px" }}>
              {/* TODO: Check if user is approved for token before displaying book */}
              <PDFViewer
                backend={PDFJSBackend}
                src={this.state.selectedBook}
                // src={sampleEncrypted}
                // password={"password"}
              />
            </Container>
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
    const { book } = this.props;
    return (
      <Row className="catalogRow">
        <Col className="catalogCol">{book.title}</Col>
        <Col className="catalogCol">{book.author}</Col>
        <Col className="catalogCol">
          <Button className="checkoutBtn" onClick={e => this.handleSelect(e)}>
            Select Book
          </Button>
        </Col>
      </Row>
    );
  }
}

export default DailyShelf;
