const { get } = require("config");
const { verify } = require("jsonwebtoken");

module.exports = function(req, res, next) {
  if (!get("requiresAuth")) return next();

  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = verify(token, get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
