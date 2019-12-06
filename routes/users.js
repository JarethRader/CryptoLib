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
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  if (!address) {
    return res.status(400).json({ msg: "No web3 provider detected" });
  }
  if (!username) {
    username = "";
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
              if (err) {
                console.log(err);
                throw err;
              }
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
router.post("/login", (req, res) => {
  if (!req.body.password) {
    return res.status(400).json({ msg: "Please enter password" });
  }
  if (!req.body.address) {
    return res.status(400).json({ msg: "Web3 provider not detected" });
  }
  User.findOne({ address: req.body.address.toLowerCase() }).then(user => {
    if (!user || user === null) {
      res.status(400).json({ msg: "Invalid password" });
    }
    //Compare hash with
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
      jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) {
            console.log(err);
            res.status(400).json({ err: err });
          }
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
router.get("/auth", auth, (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      res.status(200).json({ user });
    })
    .catch(err => {
      console.log(err);
      return res.status(400).json({ msg: "User not found" });
    });
});

//@route GET /user
//@desc check if user exists
//@access public
router.get("/", (req, res) => {
  User.find({ address: req.query.address })
    .then(user => {
      if (user[0].address === req.query.address) {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ success: false });
    });
});

module.exports = router;
