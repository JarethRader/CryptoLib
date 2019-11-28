import dotenv from "dotenv";

function exec(req, res, next) {
  const execAddr = req.header("x-exec-addr");

  if (!execAddr) {
    return res
      .status(400)
      .json({ msg: "Address is not authorized to perform this function" });
  }

  try {
    if (execAddr === process.env.CEO_ADDRESS) {
      next();
    } else {
      throw Error("Invalid Address");
    }
  } catch (err) {
    return res.status(400).json({ msg: "Invalid address" });
  }
}
