const Joi = require("@hapi/joi");
const { Schema, model } = require("mongoose");

const Customer = model(
  "Customer",
  new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    isGold: { type: Boolean, default: false }
  })
);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(5)
      .required(),
    phone: Joi.string()
      .min(10)
      .max(10)
      .required(),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
}

module.exports = { Customer, validateCustomer };
