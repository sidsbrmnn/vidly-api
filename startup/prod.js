const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("morgan");

module.exports = function(app) {
  app.use(compression());
  app.use(cors());
  app.use(helmet());
  app.use(logger("dev"));
};
