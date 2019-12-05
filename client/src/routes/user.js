import React, { Component } from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { getMetamaskAddress, loadUser } from "../actions/userAction";
import { getOwn } from "../actions/libraryActions";
import loadUserAddress from "../features/utils/loadUserAddress";
import checkUserExists from "../features/utils/checkUserExists";
import LoginModal from "../components/loginModal";
import UserDashboard from "../components/userDashboard";

export class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoginModal: false,
      userExists: null
    };
  }

  async componentDidMount() {
    try {
      if (window.web3) {
        if (!this.props.userAddress) {
          await loadUserAddress().then(async account => {
            await this.props.getMetamaskAddress(account);
            await this.props.loadUser();
          });
        }
      }
      await this.checkExists();
    } catch (err) {
      // console.log(err)
    }
  }

  checkExists = async () => {
    if (!this.props.isAuthenticated) {
      await checkUserExists(this.props.userAddress)
        .then(async exists => {
          if (this.props.isAuthenticated && exists) {
            this.setState({ userExists: true });
            await this.props.getOwn(this.props.userAddress);
          } else {
            this.setState({ userExists: false });
          }
        })
        .catch(err => {
          this.setState({ userExists: false });
        });
    }
  };

  toggleLoginModal = async () => {
    await this.checkExists();
    this.setState({ showLoginModal: !this.state.showLoginModal });
  };

  render() {
    const { isAuthenticated, userAddress } = this.props;
    return (
      <div className="pageBody user">
        {window.web3 ? (
          <div>
            {userAddress ? (
              <div>
                {isAuthenticated ? (
                  <div>
                    <UserDashboard />
                  </div>
                ) : (
                  <div>
                    <h1>Start reading!</h1>
                    <Button onClick={this.toggleLoginModal}>Sign In</Button>
                    <LoginModal
                      toggleModal={this.toggleLoginModal}
                      showModal={this.state.showLoginModal}
                      userExists={this.state.userExists}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h1>Metamask is locked</h1>
                <h3>Simply open Metamask and follow the instructions</h3>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h1>No web3 provider detected</h1>
            <h3>Please Install Metamask</h3>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated,
  user: state.user.user,
  userAddress: state.user.userAddress,
  ownShelf: state.library.ownShelf
});

export default connect(mapStateToProps, {
  getMetamaskAddress,
  loadUser,
  getOwn
})(User);
