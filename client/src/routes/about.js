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
            CryptoLib is a personal project of mine that I've been working on
            for about a year. I couldn't find a reliable source for looking at
            complete books online that didn't seem sketchy, so I decided to make
            my own. It is definitly not perfect, but that's because I'm not
            perfect, ok... I'm trying my best.
          </p>
          <br />
        </div>
        <div className="slide">
          <h1 className="orbitronFont">The Vision of CryptoLib</h1>
          <p>
            My end goal for what I want Crpyotlib to be is to serve as the
            mainstream choice for online textbooks. I was motivated because I'm
            a poor college student and I'm always trying to save my money where
            I can, which usually always happens with my class textbooks. The
            digital textbook market is pretty awful in my eyes; you either
            pirate them, ask for a free copy from strangers only for them to
            charge you anyway, or pay an outrageous amount for a copy from the
            publisher.
          </p>
        </div>
      </div>
    );
  }
}

export default About;
