import Web3 from "web3";

const loadWeb3 = () => {
  return new Promise(function(resolve, reject) {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        window.ethereum
          .enable()
          .then(() => {
            //console.log("Accounts now exposed");
            resolve(window.ethereum);
          })
          .catch(error => {
            // console.log(error);
            reject(error);
          });
      } catch (error) {
        //User denied account access
        // console.log(error).then(() => {
        //   console.log("unable to obtain MetaMask Account");
        // });
        reject(error);
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
        .then(() => {
          //console.log("Accounts always exposed");
          resolve(window.web3);
        })
        .catch(error => {
          //console.log(error);
          reject(error);
        });
    } else {
      alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }

    if (
      typeof window.web3 !== "undefined" ||
      typeof window.ethereum !== "undefined"
    ) {
      window.web3.eth.net.getNetworkType().then(function(netID) {
        if (netID !== "rinkeby") {
          alert("Select Rinkeby Ethereum Test Network in MetaMask");
          reject("Select Rinkeby Ethereum Test Network in MetaMask");
        }
      });
    }
  });
};

export default loadWeb3;
