import React, { Component } from "react";
import "./route.css";

class About extends Component {
  render() {
    return (
      <div className="pageBody about">
        <div className="slide">
          <h1 className="orbitronFont"> About CryptoLib </h1>
          <br />
          <p>
            CryptoLib is a virtual library to both preserve and disseminate
            knowledge in the form of books and textbooks available anywhere,
            interned eternally on the blockchain.{" "}
          </p>
          <br />
        </div>
        <div className="slide">
          <h1 className="orbitronFont">The mission motivating CryptoLib</h1>
          <p>
            Blockchain is an advancing but underutilized technology. Part of
            CrytoLibs's mission is to spur the development of new services that
            make use of blockchain technology The financial benefits of the
            ability to preserve immutable copies of information is already being
            explored, but leisure and education are still in their infancy.
            CryptoLib is the first step in realizing the potential of blockchain
            technology. CryptoLib allows authors to reach new audiences,
            historians to maintain important texts, and educators access to a
            permanent worldwide network of books.
            <br />
            <br />
            With CryptoLib, we hope to get more people involved with what
            blockchains are capable of. Exposing them to the possibilities,
            hopefully encouraging more adoption or even some to venture into
            creating their own blockchain application.
            <br />
            <br />
            But why did we choose books? We believe information should be
            available to whoever wants it, without barriers. With CryptoLib, we
            aim to make as wide of a selection of books as possible available to
            the public, accessible by anyone, from anywhere.
          </p>
        </div>
        {/* <h1>What does it cost to use?</h1>
        <p>
          Blockchains communicate by sending transactions from users to the
          blockchain, and sending transactions cost a little bit of ethereum,
          termed 'gas'. Although this website is free to access, it will cost
          some ethereum to initially sign up, checkout and return books. These
          transactions will cost between $0.05-$0.12; while they are relatively
          cheap, it is more than nothing. If you have insignificant funds, the
          transaction will fail to send.
        </p> */}
      </div>
    );
  }
}

export default About;
