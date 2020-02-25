//Express dependencies
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

//get User model
const User = require("../models/User");

//TODO routes:
// 1. update/reset password
// 2. change username
// 3. change email
// 4. delete user

//@route POST /user/signup
//@desc register new user
//@access public
router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const address = req.body.address.toLowerCase();
  const email = req.body.email.toLowerCase();

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  if (!address) {
    return res.status(400).json({ message: "No web3 provider detected" });
  }
  if (!username) {
    username = "";
  }

  User.findOne({ address }).then(user => {
    if (user)
      return res.status(400).json({ message: "Address is already registered" });
    User.findOne({ email }).then(user => {
      if (user)
        return res
          .status(400)
          .json({ message: "Email is already registered " });
    });

    const newUser = new User({
      username,
      address,
      email,
      password
    });

    // Create salt and hash
    try {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then(user => {
            jwt.sign(
              { id: user.id },
              process.env.JWT_SECRET,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) {
                  throw err;
                }
                res.json({
                  token,
                  user: {
                    id: user.id,
                    username: newUser.username
                  }
                });
              }
            );
          });
        });
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to create new user", err: err });
    }
  });
});

//@route POST /user/login
//@desc authenticates a user when they login again
//@access public
router.post("/login", (req, res) => {
  if (!req.body.password) {
    return res.status(400).json({ message: "Please enter password" });
  }
  if (!req.body.address) {
    return res.status(400).json({ message: "Web3 provider not detected" });
  }
  User.findOne({ address: req.body.address.toLowerCase() }).then(user => {
    if (!user || user === null) {
      res.status(400).json({ message: "Invalid password" });
    }
    //Compare hash with
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (!isMatch)
        return res.status(400).json({ message: "Invalid password" });
      jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) {
            res.status(err.response.status).json({ err: err.response.data });
          }
          res.json({
            token,
            user: {
              id: user.id,
              username: user.username
            }
          });
        }
      );
    });
  });
});

//@route GET /user/auth
//@desc get user data
//@access private
router.get("/auth", auth, (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      res.status(200).json({
        user: {
          id: user.id,
          username: user.username
        }
      });
    })
    .catch(err => {
      return res.status(400).json({ message: "User not found" });
    });
});

module.exports = router;
