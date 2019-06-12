const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");
const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");

const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find({}).sort("title");
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findOne({ _id: req.body.genreId });
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  await movie.save();

  res.send(movie);
});

router.put("/:id", validateObjectId, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findOne({ _id: req.body.genreId });
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findOneAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const movie = await Movie.findOneAndDelete({ _id: req.params.id });

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const movie = await Movie.findOne({ _id: req.params.id });

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
