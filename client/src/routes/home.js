import React, { Component } from "react";
import "./route.css";
import { Container } from "reactstrap";

class Home extends Component {
  render() {
    return (
      <div className="pageBody landing">
        <Container>
          <h1>The Blockchain Library. </h1>
          <br />
          <p>
            It's like a real library, but digital and hosted on a Blockchain.
          </p>

          <h1>What is CryptoLib?</h1>
          <p>
            In the 1731, Benjamin Franklin pioneered the first subscription
            library in America. Subscribers would pay dues to borrow books from
            a curated library. Franklin believed everyone, not just the wealthy,
            had the right to knowledge. But physical books were always subject
            to scarcity, decay, and with the advent of blockchains we continue
            the noble legacy to bring knowledge to everyone with CryptoLib.
          </p>

          <h1> Getting Started </h1>
          <p>
            CryptoLib is hosted on the Ethereum Blockchain, which means your
            browser will need the capability of connecting to the blockchain. To
            do that,{" "}
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              install the MetaMask browser plugin and sign up
            </a>
            . From there, head over to the User page and sign up on CryptoLib.
            Signing up won't require another password, it will use your unique
            MetaMask address to verify you whenever you sign in.
          </p>
          <br />
          <br />
          <p>
            CryptoLib is still in development, and because of that, it is
            currently hosted on the Rinkeby testnet, so you don't have to spend
            any money to test it out. Select the "Rinkeby Test Network" in
            metamask,{" "}
            <a
              href="https://faucet.rinkeby.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              and get some test Ethereum from a faucet.
            </a>
          </p>
          <hr className="my-2" />
          <h1>Learn More</h1>
          <p>Head over to the About page to read more about CryptoLib</p>
        </Container>
      </div>
    );
  }
}

export default Home;
