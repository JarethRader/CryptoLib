import React, { Component } from "react";
import "./route.css";
import { Container, Button, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { shelveBook } from "../actions/libraryActions";
import getBook from "../features/utils/getBook";

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
    await this.loadCatalog();
  }

  loadCatalog = async () => {
    let i = 0;
    await getBook(i).then(async book => {
      // console.log(book);
      try {
        await this.props.shelveBook(book);
        console.log(this.props.book.available);
        while (this.props.book.found === true) {
          i++;
          await getBook(i).then(nextBook => {
            try {
              this.props.shelveBook(nextBook);
              console.log(this.props.book);
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
  };

  render() {
    const { catalogData } = this.state;
    let rows = catalogData.map((book, index) => {
      return (
        <CatalogRow
          key={book.id}
          catalogData={book}
          handleOnClick={this.handleCheckoutBtn}
          index={index}
        />
      );
    });
    return (

        <div className="pageBody catalog">
          {rows} 
        </div>
    );
  }
}

class CatalogRow extends Catalog {
  render() {
    const { index, handleOnClick } = this.props;
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
  book: state.library.book,
  library: state.library.library
});

export default connect(mapStateToProps, { shelveBook })(Catalog);
