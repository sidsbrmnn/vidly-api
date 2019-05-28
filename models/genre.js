const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
  };

  return Joi.validate(genre, schema);
}

module.exports = { genreSchema, Genre, validateGenre };
