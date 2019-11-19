
const sendTransaction = (gasAmount, data) => {
    const txData = {
        gasLimit: web3.utils.toHex(gasAmount),
        gasPrice: web3.utils.toHex(10e9), // 10 Gwei
        to: libraryContract.address,
        from: userAddress,
        data: data
    };
    // console.log(txData);
    // console.log("Getting transaction count");
    web3.eth
        .getTransactionCount(userAddress, "latest")
        .then(async txCount => {
        // console.log(txCount);
        const newNonce = web3.utils.toHex(txCount);
        let transaction = new Tx(
            { ...txData, nonce: newNonce },
            { chain: "rinkeby" }
        );
        transaction.sign(key);
        const serializedTx = "0x" + transaction.serialize().toString("hex");
        // console.log(serializedTx);
        await web3.eth
            .sendSignedTransaction(serializedTx)
            .then(hash => {
            // console.log("New book minted" + hash);
            res.status(200).json({ transactionHash: hash });
            })
            .catch(err => {
            // console.log("Error: " + err);
            res.status(400).json({ error: err });
            });
        })
        .catch(err => {
        // console.log(err);
        res.status(400).json({ error: err });
        });

}

module.exports = sendTransaction;