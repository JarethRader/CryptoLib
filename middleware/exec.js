const dotenv = require("dotenv");

function exec(req, res, next) {
  const execAddr = req.header("x-exec-addr");

  if (!execAddr) {
    return res.status(400).json({ msg: "No address found" });
  }

  try {
    if (execAddr === process.env.CEO_ADDRESS) {
      next();
    } else {
      throw Error("Address is not authorized to perform this function");
    }
  } catch (err) {
    return res.status(401).json(err);
  }
}

module.exports = exec;
