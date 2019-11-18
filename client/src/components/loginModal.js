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
import { login, loadUser } from "../actions/userAction";
import { clearErrors } from "../actions/errorActions";

class LoginModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enteredPassword: "",
      enteredUsername: ""
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async e => {
    e.preventDefault();
    const { enteredUsername, enteredPassword } = this.state;
    const user = {
      username: enteredUsername,
      password: enteredPassword,
      address: this.props.userAccount
    };

    this.props.login(user);

    this.setState({ enteredUsername: "", enteredPassword: "" });
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.props.showModal} toggle={this.props.toggleModal}>
          <ModalBody>
            <Container style={{ textAlign: "center" }}>
              <h4 className="orbitronFont">Sign in</h4>
              <br />
              <hr className="my-2" />
              <b>Metamask Address</b>
              <br />
              {this.props.userAccount}
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
                      placeholder="Username"
                      name="enteredUsername"
                      onChange={e => this.onChange(e)}
                    />
                  </FormGroup>
                  <br />
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
                  <Button style={{ opacity: "100%" }} onClick={this.onSubmit}>
                    Submit
                  </Button>
                </Form>
              </div>
            </Container>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated,
  user: state.user.user,
  userAccount: state.user.userAccount,
  error: state.error
});

export default connect(mapStateToProps, { login, clearErrors, loadUser })(
  LoginModal
);
