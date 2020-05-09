import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import './route.css';
import { Helmet } from 'react-helmet';

class Home extends Component {
  render() {
    return (
      <div className='pageBody'>
        <Helmet>
          <meta charSet='utf-8' />
          <meta name='Home' content='Home page for cryptolib' />
          <title>CryptoLib - Home</title>
          <link rel='canonical' href='https://cryptolib.co' />
        </Helmet>
        <div className='intro'>
          <h1 className='orbitronFont'>
            Welcome to the library hosted on the blockchain
          </h1>
          <h3>Read from our selection of books</h3>
          <br style={{ margin: '10rem' }} />
          <Link to='/catalog' className='navBtn'>
            <Button>Start Reading</Button>
          </Link>
        </div>

        <hr className='my-2' />

        <div className='slide strokeme-inverse'>
          <div className='slide-inner'>
            <h1 className='orbitronFont'>What is CryptoLib?</h1>
            <p>
              In the 1731, Benjamin Franklin pioneered the first subscription
              library in America. He believed everyone, not just the wealthy,
              had the right to knowledge. But I've personally hated lugging
              around physical books, and when it wasn't convenient to lug around
              a whole library to look up references from mid discussion.
            </p>
            <br style={{ margin: '10rem' }} />
            <Link to='/about' className='navBtn'>
              <Button>What's our Vision?</Button>
            </Link>
          </div>
        </div>
        <hr className='my-2' />
        <div
          className='slide strokeme'
          style={{
            backgroundImage:
              'linear-gradient( 180deg,rgb(230, 230, 230) 0%,#0a960c 30%,#000000 100%)',
          }}>
          <div className='slide-inner'>
            <h1 className='orbitronFont'> Getting Started </h1>
            <p>
              CryptoLib is hosted on the Ethereum Blockchain, which means your
              browser will need the capability of connecting to the blockchain.
              Unless you're using the Brave browser,{' '}
              <a
                className='metamaskLink'
                href='https://metamask.io/'
                target='_blank'
                rel='noopener noreferrer'>
                install the MetaMask browser plugin and sign up
              </a>
              . From there, head over to the User page and sign up on CryptoLib.
            </p>
            <br style={{ margin: '10rem' }} />
            <Link to='/user' className='navBtn'>
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
