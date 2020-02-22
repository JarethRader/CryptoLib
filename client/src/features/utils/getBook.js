// import loadWeb3 from "./loadWeb3";
import axios from "axios";

const getBook = async id => {
  const config = {
    headers: {
      "Project-Secret": "1a1819184ea44c2a8d834a3f209344d8"
    }
  };
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .get(`/library?id=${id}`, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export default getBook;
