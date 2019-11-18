//setup config/headers and token
export const tokenConfig = getState => {
  //Get token from local storage
  const token = getState().user.token;

  //Headers
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };
  // If token exists then add it to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
};
