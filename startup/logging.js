require("express-async-errors");
const { handleExceptions, transports, add } = require("winston");
// require("winston-mongodb");

module.exports = function() {
  handleExceptions(
    new transports.Console({ colorize: true, prettyPrint: true }),
    new transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", ex => {
    throw new Error(ex);
  });

  add(transports.File, {
    filename: "logfile.log",
    level: "info"
  });
  /* add(transports.MongoDB, {
    db: "mongodb://localhost/vidly",
    level: "error"
  }); */
};
