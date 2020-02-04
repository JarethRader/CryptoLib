const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BookSchema = new Schema({
  bookID: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  catagory: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    require: true
  }
});

module.exports = Book = mongoose.model("book", BookSchema);
