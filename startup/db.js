const config = require("config");
const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function() {
  const db = config.get("db");
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(() => winston.info(`Connected to ${db}`));
};
