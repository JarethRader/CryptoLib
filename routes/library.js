//Express dependencies
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");

//authorization dependencies
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
//const auth = require("../middleware/auth");

//Web3 and smart contract dependencies
const Tx = require("ethereumjs-tx").Transaction;
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/aef01b012e024dc5a94f3096aa2be24f"
  )
);
const libraryContract = require("../components/LibraryContract");

const library = new web3.eth.Contract(
  libraryContract.abi,
  libraryContract.address
);

// @route post to /library/mint
// @desc adds new book to smart contract
// @access public - change to private later
router.post("/mint", async (req, res) => {
  console.log("Minting new book");
  const { userAddress, title, author, hash } = req.body;
  let bytesTitle = web3.utils.hexToBytes(web3.utils.utf8ToHex(title));
  let bytesAuthor = web3.utils.hexToBytes(web3.utils.utf8ToHex(author));
  let bytesHash = web3.utils.hexToBytes(web3.utils.utf8ToHex(hash));

  const key = new Buffer(process.env.PRIVATE_KEY, "hex");
  const data = await library.methods
    .mint(bytesTitle, bytesAuthor, bytesHash)
    .encodeABI();
  console.log(data);

  library.methods
    .mint(bytesTitle, bytesAuthor, bytesHash)
    .estimateGas({ from: userAddress, gas: 5000000 })
    .then(gasAmount => {
      const txData = {
        gasLimit: web3.utils.toHex(gasAmount),
        gasPrice: web3.utils.toHex(10e9), // 10 Gwei
        to: libraryContract.address,
        from: userAddress,
        data: data
      };
      console.log(txData);
      console.log("Getting transaction count");
      web3.eth
        .getTransactionCount(userAddress, "latest")
        .then(async txCount => {
          console.log(txCount);
          const newNonce = web3.utils.toHex(txCount);
          let transaction = new Tx(
            { ...txData, nonce: newNonce },
            { chain: "rinkeby" }
          );
          transaction.sign(key);
          const serializedTx = "0x" + transaction.serialize().toString("hex");
          console.log(serializedTx);
          await web3.eth
            .sendSignedTransaction(serializedTx)
            .then(hash => {
              console.log("New book minted" + hash);
              res.status(200).json({ transactionHash: hash });
            })
            .catch(err => {
              console.log("Error: " + err);
              res.status(400).json({ error: err });
            });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
