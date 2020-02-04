const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DailyShelfSchema = new Schema({
  shelfList: {
    type: [Number],
    required: true
  },
  update_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = dailyShelf = mongoose.model("dailyShelf", DailyShelfSchema);
