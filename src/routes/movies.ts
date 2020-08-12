import { Router } from 'express';
import { Types } from 'mongoose';

import auth from '../middlewares/auth';
import Genre from '../models/genre';
import Movie, { validateMovie } from '../models/movie';
import Rental from '../models/rental';
import HttpError from '../utils/http-error';

const router = Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().populate('genre').sort('title');

    res.send({ data: movies });
});

router.post('/', auth, async (req, res) => {
    const { error, value } = validateMovie(req.body);
    if (error) {
        throw new HttpError(400, error.details[0].message);
    }

    const genre = await Genre.findOne({ _id: value.genre });
    if (!genre) {
        throw new HttpError(400, 'Invalid genre.');
    }

    const movie = new Movie({ ...value });
    await movie.save();

    res.send({ data: movie });
});

router.put('/:id', auth, async (req, res) => {
    if (!Types.ObjectId.isValid(req.params.id)) {
        throw new HttpError(404, 'Movie with given ID was not found.');
    }

    const { error, value } = validateMovie(req.body);
    if (error) {
        throw new HttpError(400, error.details[0].message);
    }

    const genre = await Genre.findOne({ _id: value.genre });
    if (!genre) {
        throw new HttpError(400, 'Invalid genre.');
    }
    const movie = await Movie.findOneAndUpdate(
        { _id: req.params.id },
        { ...value },
        { new: true }
    );
    if (!movie) {
        throw new HttpError(404, 'Movie with given ID was not found.');
    }

    res.send({ data: movie });
});

router.delete('/:id', auth, async (req, res) => {
    if (!Types.ObjectId.isValid(req.params.id)) {
        throw new HttpError(404, 'Movie with given ID was not found.');
    }

    const movie = await Movie.findOne({ _id: req.params.id });
    if (!movie) {
        throw new HttpError(404, 'Movie with given ID was not found.');
    }

    const rentals = await Rental.find({ movie: movie._id });
    if (rentals.length > 0) {
        throw new HttpError(405, 'Movie cannot be deleted at the moment.');
    }

    await movie.remove();

    res.send({ data: movie });
});

router.get('/:id', async (req, res) => {
    if (!Types.ObjectId.isValid(req.params.id)) {
        throw new HttpError(404, 'Movie with given ID was not found.');
    }

    const movie = await Movie.findOne({ _id: req.params.id }).populate('genre');
    if (!movie) {
        throw new HttpError(404, 'Movie with given ID was not found.');
    }

    res.send({ data: movie });
});

export default router;
