import axios from "axios";

const checkUserExists = userAddress => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  return new Promise(async (resolve, reject) => {
    await axios
      .get(`/user?address=${userAddress}`, config)
      .then(res => {
        // console.log(res.data.success);
        if (res.data.success) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default checkUserExists;
