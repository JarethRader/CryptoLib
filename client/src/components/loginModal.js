import React, { Component } from "react";
import "../App.css";
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody
} from "reactstrap";
import { connect } from "react-redux";
import { login, loadUser, register } from "../actions/userAction";
import { clearErrors } from "../actions/errorActions";

class LoginModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enteredPassword: "",
      enteredUsername: "",
      enteredEmail: ""
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = async e => {
    e.preventDefault();
    const { enteredPassword } = this.state;
    const user = {
      password: enteredPassword,
      address: this.props.userAddress
    };
    try {
      await this.props.login(user);
    } catch (err) {
      console.log(err);
    }

    this.setState({ enteredPassword: "" });
  };

  handleRegister = async e => {
    e.preventDefault();
    const { enteredUsername, enteredPassword, enteredEmail } = this.state;
    const user = {
      username: enteredUsername,
      password: enteredPassword,
      email: enteredEmail,
      address: this.props.userAddress
    };

    console.log(user);

    try {
      await this.props.register(user);
    } catch (err) {
      console.log(err);
    }

    this.setState({
      enteredUsername: "",
      enteredPassword: "",
      enteredEmail: ""
    });
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.props.showModal} toggle={this.props.toggleModal}>
          {this.props.userExists ? (
            <ModalBody>
              <Container style={{ textAlign: "center" }}>
                <h4 className="orbitronFont">Sign in</h4>
                <br />
                <hr className="my-2" />
                <b>Address</b>
                <br />
                {this.props.userAddress}
                <br />
                <div style={{ textAlign: "left" }}>
                  <Form>
                    <FormGroup>
                      <Label for="password">
                        <b>Password</b>
                      </Label>
                      <Input
                        type="password"
                        id="password"
                        placeholder="Password"
                        name="enteredPassword"
                        onChange={e => this.onChange(e)}
                      />
                    </FormGroup>
                    <Button
                      style={{ opacity: "100%" }}
                      onClick={this.handleLogin}
                    >
                      Submit
                    </Button>
                  </Form>
                </div>
              </Container>
            </ModalBody>
          ) : (
            <ModalBody>
              <Container style={{ textAlign: "center" }}>
                <h4 className="orbitronFont">Register</h4>
                <br />
                <hr className="my-2" />
                <b>Metamask Address</b>
                <br />
                {this.props.userAddress}
                <br />
                <div style={{ textAlign: "left" }}>
                  <Form>
                    <FormGroup>
                      <Label for="username">
                        <b>Username</b>
                      </Label>
                      <Input
                        type="username"
                        id="username"
                        placeholder="Username (Optional)"
                        name="enteredUsername"
                        onChange={e => this.onChange(e)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="email">
                        <b>Email</b>
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        placeholder="Email"
                        name="enteredEmail"
                        onChange={e => this.onChange(e)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="password">
                        <b>Password</b>
                      </Label>
                      <Input
                        type="password"
                        id="password"
                        placeholder="Password"
                        name="enteredPassword"
                        onChange={e => this.onChange(e)}
                      />
                    </FormGroup>
                    <Button
                      style={{ opacity: "100%" }}
                      onClick={this.handleRegister}
                    >
                      Submit
                    </Button>
                  </Form>
                </div>
              </Container>
            </ModalBody>
          )}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated,
  user: state.user.user,
  userAddress: state.user.userAddress,
  error: state.error
});

export default connect(mapStateToProps, {
  login,
  clearErrors,
  loadUser,
  register
})(LoginModal);
