/* eslint-disable no-unused-vars */
const { error } = require("winston");

module.exports = function(err, req, res, next) {
  error(err.message, err);

  res.status(500).send("Something failed.");
};
