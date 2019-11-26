import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from "reactstrap";
import { connect } from "react-redux";
import { getOwn } from "../actions/libraryActions";
import getBook from "../features/utils/getBook";

export class UserDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggleNav = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  populateShelf = async () => {
    try {
      await this.props.getOwn(this.props.userAddress);
      if (this.props.ownShelf[0]) {
        this.props.ownShelf.forEach(async bookID => {
          await getBook(bookID).then(book => {
            this.setState({ shelfData: [book, ...this.state.shelfData] });
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
    console.log(this.state.shelfData);
  };

  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">{this.props.user.username}</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink>My Shelf</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapPropsToState = state => ({
  isAuthenticated: state.user.isAuthenticated,
  user: state.user.user,
  userAddress: state.user.userAddress,
  ownShelf: state.library.ownShelf
});

export default connect(mapPropsToState, { getOwn })(UserDashboard);
