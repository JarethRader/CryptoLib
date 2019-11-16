const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

// initial express backend
const app = express();

//mongoDB uri config
const db = process.env.MONGO_URI;

//define mongoos port
const port = process.env.PORT || 5000;

//body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/library", require("./routes/library"));

//connect to Mongo
// mongoose
//   .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected..."))
//   .catch(err => console.log(err));

//use routes

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
