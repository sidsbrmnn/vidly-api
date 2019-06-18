const { compare } = require("bcrypt");
const Joi = require("@hapi/joi");
const { Router } = require("express");
const { User } = require("../models/user");

const router = Router();

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

function validateUser(req) {
  const schema = {
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
