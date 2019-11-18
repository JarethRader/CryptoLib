import loadWeb3 from "./loadWeb3";

const loadUserAddress = async () => {
  try {
    await loadWeb3();
    return new Promise(async (resolve, reject) => {
      window.web3.eth
        .getAccounts()
        .then(accounts => {
          resolve(accounts[0]);
        })
        .catch(err => {
          reject(err);
        });
    });
  } catch (err) {
    return err;
  }
};

export default loadUserAddress;
