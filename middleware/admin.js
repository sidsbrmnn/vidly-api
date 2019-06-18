const { get } = require("config");

module.exports = function(req, res, next) {
  if (!get("requiresAuth")) return next();

  if (!req.user.isAdmin) return res.status(403).send("Access denied.");
  next();
};
