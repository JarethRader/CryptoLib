import Web3 from "web3";

const loadWeb3 = () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      window.ethereum
        .enable()
        .then(() => {
          // console.log("Accounts now exposed");
        })
        .catch(error => {
          // console.log(error);
        });
    } catch (error) {
      // User denied account access
      // console.log(error).then(() => {
      //   // console.log("unable to obtain MetaMask Account");
      // });
    }
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
      .then(() => {
        // console.log("Accounts always exposed");
      })
      .catch(error => {
        // console.log(error);
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
      }
    });
  }
};

export default loadWeb3;
