# CryptoLib

CryptoLib is a Blockchain hosted online library. The mission of CryptoLib is to have any book, available to anyone, at anytime, anywhere.

## Create a Metamask Account
This project is a Decentralized App which means it needs to connect to the Ethereum Blockchain. We do that through Metamask.

1. Install the [Metamask](https://metamask.io/) browser plugin. This is necessary to allow your browser to connect
   to the ethereum blockchain.
2. Change the network that Metamask is connected to from 'Main Ethereum Network' to 'Rinkeby Test Network'. You can
   get some test Ethereum from the [sink](https://faucet.rinkeby.io/). Copy your account address from Metamask(This 
   is a hex string staring with 'Ox') and make a post on either Facebook or Twitter containing your address, and copy
   the url for that post into the Rinkeby Authenticated Faucet. The Ether should appear in your acount after half a minute.
3. When you start the development server and open the webpage, metamask will ask you to login in order to connect to
   the site.
4. You are now setup for development!

## Development Setup

You will need [git](https://git-scm.com/downloads) to clone this repo.

You need [NodeJS + npm](https://nodejs.org/en/download/). Run ```npm install``` and ```npm run client-install``` to install
all the dependencies for this project.
 
#### smart contract development
If you're making changes to the smart contracts found under the `/SmartContracts/contracts` folder, you will need to install the [Truffle suite](https://www.trufflesuite.com/docs/truffle/overview) with ```npm install truffle -g```. 

If you're on windows, you might need to rename `truffle-config.js` to `truffle.js`

To test your changes, run the [Ganache CLI](https://www.trufflesuite.com/ganache), and run ```truffle compile``` to update the contract .json in the build folder, run ```truffle migrate``` to update the changed on the Ganache CLI, and finally run ```truffle test``` to run the mocha.js tests found under `SmartContracts/LibraryTest.js`
