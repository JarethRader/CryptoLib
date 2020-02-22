import React, { Component } from "react";
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { connect } from "react-redux";
import { clearErrors, hideErrorModal } from "../actions/errorActions";

export class ErrorModal extends Component {
  componentWillUnmount = () => {
    this.props.clearErrors();
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.props.showModal} toggle={this.props.hideErrorModal}>
          <ModalHeader toggle={this.props.hideErrorModal}>
            Something Went Wrong
          </ModalHeader>
          <ModalBody>
            <Container style={{ textAlign: "center" }}>
              {this.props.errorMsg}
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.props.hideErrorModal}>
              Continue
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  errorMsg: state.error.msg,
  showModal: state.error.showErrorModal
});

export default connect(mapStateToProps, {
  clearErrors,
  hideErrorModal
})(ErrorModal);
