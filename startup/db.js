const config = require("config");
const { connect } = require("mongoose");
const { info } = require("winston");

module.exports = function() {
  const db = config.get("db");
  connect(
    db,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  ).then(() => info(`Connected to ${db}`));
};
