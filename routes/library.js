//Express dependencies
const express = require("express");
const router = express.Router();

//authorization dependencies
const auth = require("../middleware/auth");
const exec = require("../middleware/exec");
const sendTransaction = require("../components/sendTransaction");

//Web3 and smart contract dependencies
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://rinkeby.infura.io/v3/${process.env.WEB3_INFURA_PROJECT_ID}`
  )
);
const libraryContract = require("../components/LibraryContract");

const library = new web3.eth.Contract(
  libraryContract.abi,
  libraryContract.address
);

const Book = require("../models/Book");
const DailyShelf = require("../models/DailyShelf");

// @route post to /library/mint
// @desc adds new book to smart contract
// @access public - change to private later
router.post("/mint", exec, async (req, res) => {
  const { title, author, hash } = req.body;
  let bytesTitle = web3.utils.hexToBytes(web3.utils.utf8ToHex(title));
  let bytesAuthor = web3.utils.hexToBytes(web3.utils.utf8ToHex(author));
  let bytesHash = web3.utils.hexToBytes(web3.utils.utf8ToHex(hash));
  let bookID = await Book.countDocuments({}).exec();

  let newBook = new Book({
    bookID,
    title,
    author,
    catagory: "",
    hash
  });

  const data = await library.methods
    .mint(bytesTitle, bytesAuthor, bytesHash)
    .encodeABI();

  await library.methods
    .mint(bytesTitle, bytesAuthor, bytesHash)
    .estimateGas({ from: process.env.CEO_ADDRESS, gas: 5000000 })
    .then(async gasAmount => {
      await sendTransaction(gasAmount, data)
        .then(receipt => {
          newBook.save();
          res.status(200).json({ transactionReceipt: receipt });
        })
        .catch(err => {
          res.status(500).json({ msg: "Failed to send transaction", err: err });
        });
    })
    .catch(err => {
      res.status(500).json({ msg: "Failed to create transaction", error: err });
    });
});

// @route GET /library
// @desc Get book by ID
// @access public
router.get("/", (req, res) => {
  Book.findOne({ bookID: req.query.id })
    .then(book => {
      res.status(200).json({
        id: book.bookID,
        title: book.title,
        author: book.author,
        hash: book.hash,
        available: book.available
      });
    })
    .catch(err => {
      res.status(504).json({ msg: "Book not found" });
    });
});

//@route POST /library/checkout
//@desc checkout a book
//@access public - change to private later
router.post("/checkout", auth, async (req, res) => {
  const { bookID, userAddress } = req.body;

  if (!bookID || !userAddress) {
    return res.status(400).json({ msg: "Invalid Input" });
  }
  try {
    await web3.eth
      .call({
        to: libraryContract.address,
        data: await library.methods.balanceOf(userAddress).encodeABI()
      })
      .then(async balance => {
        if (web3.utils.hexToNumber(balance) === 2) {
          return res
            .status(400)
            .json({ msg: "Too many books checked out already" });
        } else {
          //change transfer method to checkout method, which will transfer and approve in one function
          const data = await library.methods
            .transfer(userAddress, bookID)
            .encodeABI();
          await library.methods
            .transfer(userAddress, bookID)
            .estimateGas({ from: process.env.CEO_ADDRESS, gas: 5000000 })
            .then(async gasAmount => {
              await sendTransaction(gasAmount, data)
                .then(receipt => {
                  res.status(200).json({ transactionReceipt: receipt });
                })
                .catch(err => {
                  res
                    .status(500)
                    .json({ msg: "Failed to send transaction", err: err });
                });
            })
            .catch(err => {
              res
                .status(500)
                .json({ msg: "Failed to create transaction", error: err });
            });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ msg: "Failed to get token balance of user", err: err });
      });
  } catch (err) {
    res
      .status(500)
      .json({ msg: `Failed to checkout book of id ${bookID}`, err: err });
  }
});

//@route POST /library/getOwn
//@desc get books checked out by user
//@access public - change to private later
router.post("/getOwn", async (req, res) => {
  const { address } = req.body;
  try {
    await web3.eth
      .call({
        to: libraryContract.address,
        data: await library.methods.tokensOfOwner(address).encodeABI()
      })
      .then(async tokensOfOwner => {
        await web3.eth.call({
          to: libraryContract.address,
          data: await library.methods.balanceOf(address).encodeABI()
        });
        let stripped = tokensOfOwner.slice(2);
        let booksOfOwner = stripped
          .match(/.{1,64}/g)
          .map(s => parseInt("0x" + s));
        booksOfOwner.splice(0, 2);
        res.status(200).json({ booksOfOwner });
      })
      .catch(err => {
        throw new Error({
          msg: "Failed to get tokens owned by user",
          err: err
        });
      });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to get tokens owned by user", err: err });
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
                    res
                      .status(500)
                      .json({ msg: "Failed to send transaction", err: err });
                  });
              })
              .catch(err => {
                res
                  .status(500)
                  .json({ msg: "Failed to create transaction", err: err });
              });
          });
      })
      .catch(err => {
        res.status(500).json({
          msg: "Failed to get COO address from smart contract",
          err: err
        });
      });
  } catch (err) {
    res
      .status(500)
      .json({ msg: `Failed to return book of id ${bookID}`, err: err });
  }
});

//TODO add support for searching different catagories
router.get("/search", async (req, res) => {
  const { search, field } = req.query;
  if (!search) {
    return res.status(400).json({ msg: "Query is empty" });
  }
  let query = new RegExp(search, "i");

  let idList = [];

  await Book.find({ title: query }, "bookID")
    .then(async res => {
      await res.forEach(element => {
        idList.push(element.bookID);
      });
    })
    .catch(err => {
      return res.status(400).json({ msg: "Invalid query" });
    });

  await Book.find({ author: query }, "bookID")
    .then(async res => {
      await res.forEach(async element => {
        if (!idList.includes(element.bookID)) {
          idList.push(element.bookID);
        }
      });
    })
    .catch(err => {
      return res.status(400).json({ msg: "Invalid query" });
    });

  return res.status(200).json(idList);
});

router.get("/lastIndex", async (req, res) => {
  try {
    let len = await Book.countDocuments({}).exec();
    return res.status(200).json({ data: len });
  } catch (err) {
    res.status(500);
  }
});
router.get("/dailyShelf", (req, res) => {
  DailyShelf.findById("5e38bf40ca45d527d6f574cf")
    .then(shelf => {
      return res.status(200).json({ shelf: shelf });
    })
    .catch(err => { 
      return res
        .status(500)
        .json({ msg: "Failed to get daily shelf", err: err });
    });
});

//TODO add support for searching different catagories
router.get("/search", async (req, res) => {
  const { search, field } = req.query;
  if (!search) {
    return res.status(400).json({ msg: "Query is empty" });
  }
  let query = new RegExp(search, "i");

  let idList = [];

  await Book.find({ title: query }, "bookID")
    .then(async res => {
      await res.forEach(element => {
        idList.push(element.bookID);
      });
    })
    .catch(err => {
      return res.status(400).json({ msg: "Invalid query" });
    });

  await Book.find({ author: query }, "bookID")
    .then(async res => {
      await res.forEach(async element => {
        if (!idList.includes(element.bookID)) {
          idList.push(element.bookID);
        }
      });
    })
    .catch(err => {
      return res.status(400).json({ msg: "Invalid query" });
    });

  return res.status(200).json(idList);
});

router.get("/lastIndex", async (req, res) => {
  try {
    let len = await Book.countDocuments({}).exec();
    return res.status(200).json({ data: len });
  } catch (err) {
    res.status(500);
  }
});
router.get("/dailyShelf", (req, res) => {
  DailyShelf.findById("5e38bf40ca45d527d6f574cf")
    .then(shelf => {
      return res.status(200).json({ shelf: shelf });
    })
    .catch(err => { 
      return res
        .status(500)
        .json({ msg: "Failed to get daily shelf", err: err });
    });
});

//TODO add support for searching different catagories
router.get("/search", async (req, res) => {
  const { search, field } = req.query;
  if (!search) {
    return res.status(400).json({ msg: "Query is empty" });
  }
  let query = new RegExp(search, "i");

  let idList = [];

  await Book.find({ title: query }, "bookID")
    .then(async res => {
      await res.forEach(element => {
        idList.push(element.bookID);
      });
    })
    .catch(err => {
      return res.status(400).json({ msg: "Invalid query" });
    });

  await Book.find({ author: query }, "bookID")
    .then(async res => {
      await res.forEach(async element => {
        if (!idList.includes(element.bookID)) {
          idList.push(element.bookID);
        }
      });
    })
    .catch(err => {
      return res.status(400).json({ msg: "Invalid query" });
    });

  return res.status(200).json(idList);
});

router.get("/lastIndex", async (req, res) => {
  try {
    let len = await Book.countDocuments({}).exec();
    return res.status(200).json({ data: len });
  } catch (err) {
    res.status(500);
  }
});
router.get("/dailyShelf", (req, res) => {
  DailyShelf.findById("5e38bf40ca45d527d6f574cf")
    .then(shelf => {
      return res.status(200).json({ shelf: shelf });
    })
    .catch(err => { 
      return res
        .status(500)
        .json({ msg: "Failed to get daily shelf", err: err });
    });
});

module.exports = router;
