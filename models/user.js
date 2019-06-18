const { get } = require("config");
const Joi = require("@hapi/joi");
const { sign } = require("jsonwebtoken");
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

userSchema.methods.generateAuthToken = function() {
  const token = sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin
    },
    get("jwtPrivateKey")
  );
  return token;
};

const User = model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .min(6)
      .max(16)
      .required()
  };

  return Joi.validate(user, schema);
}

module.exports = { User, validateUser };
