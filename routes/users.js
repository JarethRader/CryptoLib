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
  const { username, email, password, address } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  if (!address) {
    return res.status(400).json({ msg: "No web3 provider detected" });
  }

  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({
      username,
      address,
      email,
      password
    });

    // Create salt and hash
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
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  address: newUser.address,
                  username: newUser.username,
                  email: newUser.email
                }
              });
            }
          );
        });
      });
    });
  });
});

//@route POST /user/login
//@desc authenticates a user when they login again
//@access public
router.post("/auth", (req, res) => {
  const { username, password, address } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  if (!address) {
    return res.status(400).json({ msg: "Web3 provider not detected" });
  }
  User.findOne({ address }).then(user => {
    if (!user) res.status(400).json({ msg: "User does not exists" });
    //Compare hash with
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
      jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              address: user.address,
              username: user.username,
              email: user.email
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
router.get("/", auth, (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      res.status(200).json({ user });
    })
    .catch(err => {
      console.log(err);
      return res.status(400).json({ msg: "User not found" });
    });
});

module.exports = router;
