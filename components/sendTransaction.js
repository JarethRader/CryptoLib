const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/aef01b012e024dc5a94f3096aa2be24f"
  )
);
const Tx = require("ethereumjs-tx").Transaction;
const libraryContract = require("../components/LibraryContract");

const sendTransaction = (gasAmount, data) => {
  const key = new Buffer(process.env.PRIVATE_INFURA_KEY, "hex");
  const txData = {
    gasLimit: web3.utils.toHex(gasAmount),
    gasPrice: web3.utils.toHex(10e9), // 10 Gwei
    to: libraryContract.address,
    from: process.env.CEO_ADDRESS,
    data: data
  };
  console.log(txData);
  console.log("Getting transaction count");
  return new Promise((resolve, reject) => {
    web3.eth
      .getTransactionCount(process.env.CEO_ADDRESS, "latest")
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
            resolve(hash);
          })
          .catch(err => {
            console.log("Error: " + err);
            reject(err);
          });
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

module.exports = sendTransaction;