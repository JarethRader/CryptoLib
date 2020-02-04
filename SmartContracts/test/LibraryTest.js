// const Library = artifacts.require("Library");
// //const truffleAssert = require('truffle-assertions');

// contract("Library Core", accounts => {
//   var tokenInstance;

//   it("creates a new contract with the appropriate owner", async () => {
//     tokenInstance = await Library.deployed();
//     await assert.equal(await tokenInstance.ceoAddress(), accounts[0]);
//     await assert.equal(await tokenInstance.cfoAddress(), accounts[0]);
//     await assert.equal(await tokenInstance.cooAddress(), accounts[0]);
//   });

//   it("checks contract pausability", async () => {
//     tokenInstance = await Library.deployed();
//     await assert.equal(await tokenInstance.isPaused(), true);
//     await tokenInstance.unpause();
//     await assert.equal(await tokenInstance.isPaused(), false);
//     await tokenInstance.pause();
//     await assert.equal(await tokenInstance.isPaused(), true);
//   });

//   it("creates a new book owned by the contract owner", async () => {
//     tokenInstance = await Library.deployed();
//     let book = await tokenInstance.mint(
//       web3.utils.hexToBytes(web3.utils.utf8ToHex("English Fairy Tales")),
//       web3.utils.hexToBytes(web3.utils.utf8ToHex("Flora Annie Steel")),
//       web3.utils.hexToBytes(
//         web3.utils.utf8ToHex("QmZefu4AZ9uXCWNCNGqsoUCvdMHHRVXPnmajnhQHw5WujP")
//       )
//     );
//     const { title, author, hash } = await tokenInstance.getBook(0);
//     await assert.deepEqual(
//       [
//         web3.utils.toAscii(title),
//         web3.utils.toAscii(author),
//         web3.utils.toAscii(hash)
//       ],
//       [
//         "English Fairy Tales",
//         "Flora Annie Steel",
//         "QmZefu4AZ9uXCWNCNGqsoUCvdMHHRVXPnmajnhQHw5WujP"
//       ]
//     );
//   });

//   it("handles book transfering", async () => {
//     tokenInstance = await Library.deployed();
//     if (await tokenInstance.isPaused()) {
//       await tokenInstance.unpause();
//     }
//     // const { title, author, hash } = await tokenInstance.getBook(0);
//     // await assert.deepEqual(
//     //   [
//     //     web3.utils.toAscii(title),
//     //     web3.utils.toAscii(author),
//     //     web3.utils.toAscii(hash)
//     //   ],
//     //   ["Title", "Author", "Hash"]
//     // );
//     let toAccount = accounts[1];
//     let fromAccount = accounts[0];
//     await tokenInstance.transfer(toAccount, 0);
//     await assert.equal(await tokenInstance.ownerOf(0), toAccount);
//     await tokenInstance.transferFrom(toAccount, fromAccount, 0);
//   });

//   //   it("handles delegated transfers", async () => {
//   //     tokenInstance = await Library.deployed();
//   //     if (await tokenInstance.isPaused()) {
//   //       await tokenInstance.unpause();
//   //     }

//   //     let fromAccount = accounts[0];
//   //     let toAccount = accounts[1];
//   //     let senderAccount = accounts[2];

//   //     //Book 1
//   //     let book1 = await tokenInstance.mint(
//   //       web3.utils.hexToBytes(web3.utils.utf8ToHex("Title1")),
//   //       web3.utils.hexToBytes(web3.utils.utf8ToHex("Author1")),
//   //       web3.utils.hexToBytes(web3.utils.utf8ToHex("Hash1"))
//   //     );
//   //     const { title1, author1, hash1 } = await tokenInstance.getBook(1);
//   //     await assert.deepEqual(
//   //       [
//   //         web3.utils.toAscii(title1),
//   //         web3.utils.toAscii(author1),
//   //         web3.utils.toAscii(hash1)
//   //       ],
//   //       ["Title1", "Author1", "Hash1"]
//   //     );

//   //     await tokenInstance.transfer(senderAccount, 0);
//   //     await assert.equal(await tokenInstance.ownerOf(0), senderAccount);

//   //     await tokenInstance.transfer(senderAccount, 1);
//   //     await assert.equal(await tokenInstance.ownerOf(1), senderAccount);

//   //     let senderAccBookCount = await tokenInstance.balanceOf(senderAccount);
//   //     await assert.equal(senderAccBookCount, 2);

//   //     try {
//   //       await tokenInstance.transfer(senderAccount, 0);
//   //     } catch (error) {
//   //       assert(
//   //         err.message.indexOf("revert") >= 2,
//   //         "an account cannot hold more than 2 books at a time"
//   //       );
//   //     }

//   //     await tokenInstance.approve(senderAccount, 0, { from: senderAccount });
//   //     await tokenInstance.transferFrom(senderAccount, toAccount, 0, {
//   //       from: senderAccount
//   //     });
//   //     await assert.equal(await tokenInstance.ownerOf(0), toAccount);

//   //     try {
//   //       await tokenInstance.transferFrom(senderAccount, toAccount, 1, {
//   //         from: senderAccount
//   //       });
//   //     } catch (err) {
//   //       assert(
//   //         err.message.indexOf("revert") >= 0,
//   //         "cannot transfer a book you do not currently own"
//   //       );
//   //     }
//   //     let howMany = await tokenInstance.balanceOf(toAccount);
//   //     await assert.equal(howMany, 1);
//   //   });
// });
