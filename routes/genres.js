const express = require("express");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const { Genre, validateGenre } = require("../models/genre");

const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find({}).sort("name");
  res.send(genres);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });

  await genre.save();

  res.send(genre);
});

router.put("/:id", validateObjectId, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findOneAndUpdate(
    { _id: req.params.id },
    { name: req.body.name },
    { new: true }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findOneAndDelete({ _id: req.params.id });

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findOne({ _id: req.params.id });

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

module.exports = router;
