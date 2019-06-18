const { Router } = require("express");
const { init, Task } = require("fawn");
const { pick } = require("lodash");
const mongoose = require("mongoose");
const validateObjectId = require("../middleware/validateObjectId");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const { Rental, validateRental } = require("../models/rental");

const router = Router();
init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find({}).sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findOne({ _id: req.body.customerId });
  if (!customer) return res.status(400).send("Invalid customer.");

  let movie = await Movie.findOne({ _id: req.body.movieId });
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  const rental = new Rental({
    customer: pick(customer, ["_id", "name", "phone", "isGold"]),
    movie: pick(movie, ["_id", "title", "dailyRentalRate"])
  });

  try {
    new Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
});

router.get("/:id", validateObjectId, async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

module.exports = router;
