const express = require("express");
const _ = require("lodash");
const validateObjectId = require("../middleware/validateObjectId");
const { Customer, validateCustomer } = require("../models/customer");

const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find({}).sort("name");
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer(_.pick(req.body, ["name", "phone", "isGold"]));

  await customer.save();

  res.send(customer);
});

router.put("/:id", validateObjectId, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id },
    _.pick(req.body, ["name", "phone", "isGold"]),
    { new: true }
  );

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const customer = await Customer.findOneAndDelete({ _id: req.params.id });

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id });

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

module.exports = router;
