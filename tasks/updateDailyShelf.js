const schedule = require("node-schedule");

const DailyShelf = require("../models/DailyShelf");
const Book = require("../models/Book");

module.exports = {
  updateDailyShelf: () => {
    {
      var j = schedule.scheduleJob("0 0 0 * * *", async function() {
        let newShelfList = [];
        let length = await Book.countDocuments({}).exec();
        let i = 0;
        while (i < 10) {
          let random = Math.floor(Math.random() * length);
          if (!newShelfList.includes(random)) {
            newShelfList.push(random);
            i++;
          }
        }
        try {
          let dailyShelf = await DailyShelf.findById(
            "5e38bf40ca45d527d6f574cf"
          );
          dailyShelf.shelfList = newShelfList;
          dailyShelf.update_date = Date.now();

          await dailyShelf.save();
        } catch (err) {
          console.log(err);
        }
      });
    }
  }
};
