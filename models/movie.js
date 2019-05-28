const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, required: true },
    dailyRentalRate: { type: Number, required: true }
  })
);

function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .min(3)
      .max(255)
      .required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(0)
      .max(255)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(255)
      .required()
  };

  return Joi.validate(movie, schema);
}

module.exports = { Movie, validateMovie };
