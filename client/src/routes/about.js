import React, { Component } from "react";
import "./route.css";
import { Helmet } from "react-helmet";

class About extends Component {
  render() {
    return (
      <div className="pageBody about">
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="about" content="About page for Cryptolib" />
          <title>CryptoLib - About</title>
          <link rel="canonical" href="https://cryptolib.co/about" />
        </Helmet>
        <div
          className="slide"
          style={{
            backgroundImage:
              "linear-gradient( 0deg,rgb(230, 230, 230) 0%,#0a960c 30%,#000000 100%)",
          }}
        >
          <div className="slide-inner strokeme">
            <h1 className="orbitronFont"> About CryptoLib </h1>
            <br />
            <p>
              CryptoLib is a personal project of mine that I've been working on
              for about a year. I couldn't find a reliable source for looking at
              complete books online that didn't seem sketchy, so I decided to
              make my own. It is definitly not perfect, but that's because I'm
              not perfect, ok... I'm trying my best.
            </p>
            <br />
          </div>
        </div>
        <div
          className="slide"
          style={{
            backgroundImage:
              "linear-gradient( 180deg,rgb(230, 230, 230) 0%,#0a960c 30%,#000000 100%)",
          }}
        >
          <div className="slide-inner strokeme">
            <h1 className="orbitronFont">The Vision of CryptoLib</h1>
            <p>
              My end goal for what I want Cryptolib to be is to serve as the
              mainstream choice for online textbooks. I was motivated because
              I'm a poor college student and I'm always trying to save my money
              where I can, which usually always happens with my class textbooks.
              The digital textbook market is pretty awful in my eyes; you either
              pirate them, ask for a free copy from strangers only for them to
              charge you anyway, or pay an outrageous amount for a copy from the
              publisher.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
