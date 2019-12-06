const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

// initial express backend
const app = express();

//mongoDB uri config
const db = process.env.MONGO_URI;

//define mongoos port
const port = process.env.PORT || 5000;

// connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

//body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//use routes
app.use("/library", require("./routes/library"));
app.use("/user", require("./routes/users"));

if (process.env.NODE_ENV == "production") {
  // Set a static folder
  require("newrelic");

  app.use(express.static("client/build"));

  app.get("*", () => (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });

  // app.use((req, res, next) => {
  //   if (req.header("x-forwarded-proto") !== "https") {
  //     res.redirect(`https://${req.header("host")}${req.url}`);
  //   } else {
  //     next();
  //   }
  // });
}

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
