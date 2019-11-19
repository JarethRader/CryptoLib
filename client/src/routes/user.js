import React, { Component } from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { getMetamaskAddress, loadUser } from "../actions/userAction";
import loadUserAddress from "../features/utils/loadUserAddress";
import LoginModal from "../components/loginModal";

export class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoginModal: false
    };
  }
  async componentDidMount() {
    if (window.web3 || !this.props.userAccount) {
      await loadUserAddress().then(async account => {
        await this.props.getMetamaskAddress(account);
        await this.props.loadUser();
      });
    }
  }

  toggleLoginModal = () => {
    this.setState({ showLoginModal: !this.state.showLoginModal });
  };

  render() {
    const { isAuthenticated, userAccount } = this.props;
    return (
      <div className="pageBody user">
        {window.web3 ? (
          <div>
            {userAccount ? (
              <div>
                {isAuthenticated ? (
                  <div>
                    <h1>You are logged in</h1>
                  </div>
                ) : (
                  <div>
                    <h1>Start reading!</h1>
                    <Button onClick={this.toggleLoginModal}>Sign In</Button>
                    <LoginModal
                      toggleModal={this.toggleLoginModal}
                      showModal={this.state.showLoginModal}
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
  userAccount: state.user.userAccount
});

export default connect(mapStateToProps, {
  getMetamaskAddress,
  loadUser
})(User);
