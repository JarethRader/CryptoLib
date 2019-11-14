const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

// bring in api routes file from ./routes/api/items.js

// initial express backend
const app = express();

//mongoDB uri config
const db = require("./config/keys").mongoURI;

//define mongoos port
const port = process.env.PORT || 5000;

//body-parser middleware
app.use(cors());
app.use(bodyParser.json());

//connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

//use routes

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
