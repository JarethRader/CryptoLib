import React, { Component } from "react";
import "../App.css";
import {
  Col,
  Row,
  Button,
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { connect } from "react-redux";
import { getOwn, returnBook } from "../actions/libraryActions";
import getBook from "../features/utils/getBook";
import PDFViewer from "../features/PDFViewer";
import PDFJSBackend from "../features/pdfBackend/pdfjs";
import BeatLoader from "react-spinners/BeatLoader";
import { shelf } from "../features/utils/override";
// import sampleEncrypted from "../features/resources/sampleEncrypted.pdf";

const initialState = {
  isOpen: false,
  dashboardPage: "",
  ownBooks: [],
  selectedBook: null,
  showSelected: false
};

export class UserDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  componentDidMount = async () => {
    try {
      await this.props.getOwn(this.props.userAddress);
    } catch (err) {
      // console.log(err)
    }
  };

  toggleNav = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleDashClick = id => {
    switch (id) {
      default:
        this.setState({ ownBooks: [] });
        this.setState({ dashboardPage: "shelf" });
        this.getOwnShelf();
        return;
    }
  };

  getOwnShelf = async () => {
    try {
      await getBook(this.props.ownShelf[0])
        .then(async book => {
          this.setState({ ownBooks: [book, ...this.state.ownBooks] });
          let i = 1;
          while (this.props.ownShelf[i]) {
            await getBook(this.props.ownShelf[i])
              .then(nextBook => {
                this.setState({ ownBooks: [nextBook, ...this.state.ownBooks] });
              })
              .catch(err => {
                // console.log(err)
              });
            i++;
          }
        })
        .catch(err => {
          // console.log(err)
        });
    } catch (err) {
      // console.log(err)
    }
  };

  setSelected = book => {
    let bookHash = book.hash;
    let address =
      "https://ipfs.infura.io/ipfs/" + bookHash + "#toolbar=0&navpanes=0";
    this.setState({ selectedBook: address }, () => {
      this.setState({ showSelected: true });
    });
  };

  render() {
    let rows = this.state.ownBooks.map((book, bookID) => (
      <ShelfRow
        key={bookID}
        book={book}
        setSelected={this.setSelected}
        returnBook={this.props.returnBook}
        returning={this.props.returning}
      />
    ));
    return (
      <div>
        <Navbar className="userDashboard" color="light" light expand="md">
          <NavbarBrand className="orbitronFont">
            <b>{this.props.user.username}</b>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem className="userDashboardBtn">
                <NavLink onClick={() => this.handleDashClick(1)}>
                  My Shelf
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Container>
          {this.state.dashboardPage === "shelf" ? (
            <div>
              <h1>Shelf</h1>
              {rows}
              <br />
              <hr className="my-2" />
              <br />
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
          ) : null}
        </Container>
      </div>
    );
  }
}

class ShelfRow extends UserDashboard {
  handleSelect = async e => {
    e.preventDefault();
    this.props.setSelected(this.props.book);
  };

  handleReturn = async e => {
    e.preventDefault();
    console.log("returning");
    await this.props.returnBook(this.props.book.id);
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
        <Col className="catalogCol">
          {this.props.returning.returnLoading &&
          this.props.returning.bookID === this.props.book.id ? (
            <BeatLoader
              css={shelf}
              sizeUnit={"rem"}
              size={1}
              color={"#0a960c"}
              loading={this.props.returning}
            />
          ) : (
            <Button className="checkoutBtn" onClick={e => this.handleReturn(e)}>
              Return
            </Button>
          )}
        </Col>
      </Row>
    );
  }
}

const mapPropsToState = state => ({
  isAuthenticated: state.user.isAuthenticated,
  user: state.user.user,
  userAddress: state.user.userAddress,
  ownShelf: state.library.ownShelf,
  returning: state.library.returning
});

export default connect(mapPropsToState, { getOwn, returnBook })(UserDashboard);
