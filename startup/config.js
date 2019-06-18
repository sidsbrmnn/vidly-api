const { get } = require("config");

module.exports = function() {
  if (!get("jwtPrivateKey"))
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
};
