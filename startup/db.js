const { get } = require("config");
const { connect } = require("mongoose");
const { info } = require("winston");

module.exports = function() {
  const db = get("db");
  connect(
    db,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  ).then(() => info(`Connected to ${db}`));
};
