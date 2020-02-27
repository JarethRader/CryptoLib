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
import { logout } from "../actions/userAction";
import { returnErrors } from "../actions/errorActions";
import getBook from "../features/utils/getBook";
import PDFViewer from "../features/PDFViewer";
import PDFJSBackend from "../features/pdfBackend/pdfjs";
import BeatLoader from "react-spinners/BeatLoader";
import { shelf } from "../features/utils/override";

const initialState = {
  isOpen: false,
  dashboardPage: "",
  ownBooks: [],
  selectedBook: null,
  selectedID: null,
  showSelected: false,
  width: window.innerWidth
};

export class UserDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  componentDidMount = async () => {
    if (this.props.isAuthenticated) {
      try {
        await this.props.getOwn(this.props.userAddress);
      } catch (err) {
        this.props.returnErrors(err.message, 500);
      }
    }

    if (this.props.transactionHash) {
      await this.resetOwnShelf();
      await this.getOwnShelf();
    }
  };

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  toggleNav = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleDashClick = id => {
    switch (id) {
      case 1:
        this.setState({ ownBooks: [] });
        this.setState({ dashboardPage: "shelf" });
        this.getOwnShelf();
        return;
      case 2:
        this.props.logout();
        this.setState(initialState);
        return;
      default:
        return;
    }
  };

  resetOwnShelf = async () => {
    this.setState({ ownBooks: [] });
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
                throw err;
              });
            i++;
          }
        })
        .catch(err => {
          throw err;
        });
    } catch (err) {
      this.props.returnErrors(err.message, 500);
    }
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
    let rows = this.state.ownBooks.map((book, bookID) => (
      <ShelfRow
        key={bookID}
        book={book}
        selectedID={this.state.selectedID}
        setSelected={this.setSelected}
        returnBook={this.props.returnBook}
        returning={this.props.returning}
      />
    ));
    const isMobile = this.state.width <= 500;
    return (
      <div>
        <Navbar className="userDashboard" light expand="md">
          <NavbarBrand className="orbitronFont">
            <b>
              {this.props.user.username ? (
                <div>{this.props.user.username}</div>
              ) : (
                <div>user</div>
              )}
            </b>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleNav} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem className="userDashboardBtn">
                <NavLink onClick={() => this.handleDashClick(1)}>
                  My Shelf
                </NavLink>
              </NavItem>
            </Nav>
            <NavItem className="logoutBtn">
              <NavLink onClick={() => this.handleDashClick(2)}>Logout</NavLink>
            </NavItem>
          </Collapse>
        </Navbar>
        <Container>
          {this.state.dashboardPage === "shelf" ? (
            <div>
              <h1>Shelf</h1>
              {this.props.ownShelf.length > 0 ? (
                <div>
                  {rows}
                  <br />
                  <hr className="my-2" />
                  <br />
                  {this.state.showSelected ? (
                    <div>
                      {isMobile === true ? (
                        <Container style={{ height: "45rem" }}>
                          {/* TODO: Check if user is approved for token before displaying book */}
                          <PDFViewer
                            backend={PDFJSBackend}
                            src={this.state.selectedBook}
                            // src={sampleEncrypted}
                            // password={"password"}
                          />
                        </Container>
                      ) : (
                        <Container style={{ height: "60rem" }}>
                          {/* TODO: Check if user is approved for token before displaying book */}
                          <PDFViewer
                            backend={PDFJSBackend}
                            src={this.state.selectedBook}
                            // src={sampleEncrypted}
                            // password={"password"}
                          />
                        </Container>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : (
                <p>You shelf is empty</p>
              )}
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
    await this.props.returnBook(this.props.book.id);
  };

  render() {
    const { book, selectedID } = this.props;
    return (
      <Row className="catalogRow">
        <Col className="catalogCol">{book.title}</Col>
        <Col className="catalogCol">{book.author}</Col>
        <Col className="catalogCol">
          {selectedID === book.id ? (
            <b>selected</b>
          ) : (
            <Button className="checkoutBtn" onClick={e => this.handleSelect(e)}>
              Select Book
            </Button>
          )}
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
  returning: state.library.returning,
  transactionHash: state.library.transactionHash
});

export default connect(mapPropsToState, {
  getOwn,
  returnBook,
  returnErrors,
  logout
})(UserDashboard);
