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

// @route GET /library
// @desc Get book by ID
// @access public
router.get("/", async (req, res) => {
  const { id } = req.query;
  try {
    await web3.eth
      .call({
        to: libraryContract.address,
        data: await library.methods.getBook(id).encodeABI()
      })
      .then(async book => {
        book = web3.utils.toAscii(book);
        book = book.replace(/\0[^0-9a-zA-Z]+/g, "");
        hash = book.substring(book.indexOf("Qm"), book.length);
        title = book.substring(0, book.match(/([a-z][A-Z][a-z])/).index + 1);
        author = book.substring(
          book.match(/([a-z][A-Z][a-z])/).index + 1,
          book.indexOf("Qm")
        );
        console.log("Getting Coo address");
        await web3.eth
          .call({
            to: libraryContract.address,
            data: await library.methods.cooAddress().encodeABI()
          })
          .then(async coo => {
            console.log("Getting owner");
            await web3.eth
              .call({
                to: libraryContract.address,
                data: await library.methods.ownerOf(id).encodeABI()
              })
              .then(owner => {
                console.log("Comparing");
                if (coo === owner) {
                  console.log("Returning book");
                  res.status(200).json({
                    title,
                    author,
                    hash,
                    available: true,
                    found: true
                  });
                } else {
                  console.log("Returning book");
                  res.status(200).json({
                    title,
                    author,
                    hash,
                    available: false,
                    found: true
                  });
                }
              })
              .catch(err => {
                res.status(400).json({ err });
              });
          })
          .catch(err => {
            res.status(400).json({ err });
          });
      })
      .catch(err => {
        console.log("Book not found");
        res.status(204).json({ found: false });
      });
  } catch (err) {
    res.status(400).json({ error: err.data });
  }
});

module.exports = router;
