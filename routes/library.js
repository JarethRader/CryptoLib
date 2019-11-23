//Express dependencies
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");

//authorization dependencies
const auth = require("../middleware/auth");
const sendTransaction = require("../components/sendTransaction");

//Web3 and smart contract dependencies
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
  // console.log("Minting new book");
  const { userAddress, title, author, hash } = req.body;
  let bytesTitle = web3.utils.hexToBytes(web3.utils.utf8ToHex(title));
  let bytesAuthor = web3.utils.hexToBytes(web3.utils.utf8ToHex(author));
  let bytesHash = web3.utils.hexToBytes(web3.utils.utf8ToHex(hash));

  const data = await library.methods
    .mint(bytesTitle, bytesAuthor, bytesHash)
    .encodeABI();
  console.log(data);

  await library.methods
    .mint(bytesTitle, bytesAuthor, bytesHash)
    .estimateGas({ from: userAddress, gas: 5000000 })
    .then(async gasAmount => {
      // console.log("Sending transaction");

      await sendTransaction(gasAmount, data)
        .then(receipt => {
          // console.log("Got transaction");
          res.status(200).json({ transactionReceipt: receipt });
        })
        .catch(err => {
          // console.log(err);
          res.status(400).json({ err: err });
        });
    })
    .catch(err => {
      // console.log(err);
      res.status(400).json({ error: err });
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
        // console.log("Getting Coo address");
        await web3.eth
          .call({
            to: libraryContract.address,
            data: await library.methods.cooAddress().encodeABI()
          })
          .then(async coo => {
            // console.log("Getting owner");
            await web3.eth
              .call({
                to: libraryContract.address,
                data: await library.methods.ownerOf(id).encodeABI()
              })
              .then(owner => {
                // console.log("Comparing");
                if (coo === owner) {
                  // console.log("Returning book");
                  res.status(200).json({
                    title,
                    author,
                    hash,
                    available: true,
                    found: true
                  });
                } else {
                  // console.log("Returning book");
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
        // console.log("Book not found");
        res.status(204).json({ err: err, found: false });
      });
  } catch (err) {
    res.status(400).json({ error: err.data });
  }
});

//@route POST /library/checkout
//@desc checkout a book
//@access private
router.post("/checkout", async (req, res) => {
  const { bookID, userAddress } = req.body;

  if (!bookID || !userAddress) {
    return res.status(400).json({ msg: "Invalid Input" });
  }
  try {
    console.log("Getting balance of");
    await web3.eth
      .call({
        to: libraryContract.address,
        data: await library.methods.balanceOf(userAddress).encodeABI()
      })
      .then(async balance => {
        console.log(web3.utils.hexToNumber(balance));
        if (web3.utils.hexToNumber(balance) === 2) {
          return res
            .status(400)
            .json({ msg: "Too many books checked out already" });
        } else {
          //Transfer book: bookID to: userAddress
          console.log("Getting Coo Address");
          console.log("Transfering book");
          console.log(userAddress);

          //change transfer method to checkout method, which will transfer and approve in one function
          const data = await library.methods
            .transfer(userAddress, bookID)
            .encodeABI();
          console.log(data);

          await library.methods
            .transfer(userAddress, bookID)
            .estimateGas({ from: process.env.CEO_ADDRESS, gas: 5000000 })
            .then(async gasAmount => {
              console.log("Sending transaction");
              await sendTransaction(gasAmount, data)
                .then(receipt => {
                  console.log("Transacton successful");
                  res.status(200).json({ transactionReceipt: receipt });
                })
                .catch(err => {
                  console.log(err);
                  res.status(400).json({ err: err });
                });
            })
            .catch(err => {
              console.log(err);
              res.status(400).json({ error: err });
            });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({ err: err });
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});

//@route POST /library/getOwn
//@desc get books checked out by user
//@access public - change to private later
router.post("/getOwn", async (req, res) => {
  const { userAddress } = req.body;

  try {
    await web3.eth
      .call({
        to: libraryContract.address,
        data: await library.methods.tokensOfOwner(userAddress).encodeABI()
      })
      .then(async tokensOfOwner => {
        await web3.eth.call({
          to: libraryContract.address,
          data: await library.methods.balanceOf(userAddress).encodeABI()
        });
        console.log(tokensOfOwner);
        let stripped = tokensOfOwner.slice(2);
        let booksOfOwner = stripped
          .match(/.{1,64}/g)
          .map(s => parseInt("0x" + s));
        booksOfOwner.splice(0, 2);
        res.status(200).json({ booksOfOwner });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({ err: err });
      });
  } catch (err) {
    res.status(400).json({ err: err });
  }
});

//@route POST /library/return
//@desc Return cehcked out book to COO Address
//@access public
//Changed this to private eventually
router.post("/return", async (req, res) => {
  //bookID to return
  const { bookID } = req.body;

  try {
    await web3.eth
      .call({
        to: libraryContract.address,
        data: library.methods.cooAddress().encodeABI()
      })
      .then(async coo => {
        await web3.eth
          .call({
            to: libraryContract.address,
            data: library.methods.ownerOf(bookID).encodeABI()
          })
          .then(async owner => {
            const data = await library.methods
              .transferFrom(
                "0x" + owner.substring(26, owner.length),
                "0x" + coo.substring(26, coo.length),
                bookID
              )
              .encodeABI();

            await library.methods
              .transferFrom(
                "0x" + owner.substring(26, owner.length),
                "0x" + coo.substring(26, coo.length),
                bookID
              )
              .estimateGas({ from: process.env.CEO_ADDRESS, gas: 5000000 })
              .then(async gasAmount => {
                await sendTransaction(gasAmount, data)
                  .then(receipt => {
                    res.status(200).json({ transactionReceipt: receipt });
                  })
                  .catch(err => {
                    res.status(400).json({ err: err });
                  });
              })
              .catch(err => {
                console.log(err);
                res.status(400).json({ err: err });
              });
          });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({ err: err });
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});

module.exports = router;

// 0xdee0601f952c2f2c9163dfbfce4581b14da3dee2
// 0xe8300c51fb172484f544369edfc9082b8cf653df
