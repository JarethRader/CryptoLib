//setup config/headers and token
export const tokenConfig = (getState, config) => {
  //Get token from local storage
  return new Promise((resolve, reject) => {
    try {
      const token = getState().user.token;
      // If token exists then add it to headers
      if (token) {
        config.headers["x-auth-token"] = token;
      }
      resolve(config);
    } catch (err) {
      reject("Unauthorized user");
    }
  });
};
