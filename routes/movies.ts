import express, { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { Types } from 'mongoose';

import Genre from '../models/genre';
import Movie, { validateMovie } from '../models/movie';
import Rental from '../models/rental';

const router = express.Router();

router.use('/:id', (req: Request, res: Response, next: NextFunction) => {
    if (!Types.ObjectId.isValid(req.params.id))
        return res.status(404).send({
            success: false,
            message: 'The movie with the given ID was not found'
        });

    next();
});

router.get('/', async (req: Request, res: Response) => {
    const movies = await Movie.find()
        .populate('genre')
        .sort('title');

    res.send({ success: true, movies });
});

router.post('/', async (req: Request, res: Response) => {
    const { error } = validateMovie(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });

    const genre = await Genre.findOne({ _id: req.body.genreId });
    if (!genre)
        return res.status(400).send({
            success: false,
            message: 'Invalid genre'
        });

    const movie = new Movie({
        ..._.pick(req.body, ['title', 'inStock', 'rentalRate']),
        genre: genre._id
    });
    await movie.save();

    res.send({ success: true, movie });
});

router.put('/:id', async (req: Request, res: Response) => {
    const { error } = validateMovie(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });

    const genre = await Genre.findOne({ _id: req.body.genreId });
    if (!genre)
        return res.status(400).send({
            success: false,
            message: 'Invalid genre'
        });

    const movie = await Movie.findOneAndUpdate(
        { _id: req.params.id },
        {
            ..._.pick(req.body, ['title', 'inStock', 'rentalRate']),
            genre: genre._id
        },
        { new: true }
    );
    if (!movie)
        return res.status(404).send({
            success: false,
            message: 'The movie with the given ID was not found'
        });

    res.send({ success: true, movie });
});

router.delete('/:id', async (req: Request, res: Response) => {
    const movie = await Movie.findOne({ _id: req.params.id });
    if (!movie)
        return res.status(404).send({
            success: false,
            message: 'The movie with the given ID was not found'
        });

    const rentals = await Rental.find({ movie: movie._id });
    if (rentals.length)
        return res.status(400).send({
            success: false,
            message: 'The movie with the given ID cannot be deleted'
        });

    await movie.remove();

    res.send({ success: true, movie });
});

router.get('/:id', async (req: Request, res: Response) => {
    const movie = await Movie.findOne({ _id: req.params.id }).populate('genre');
    if (!movie)
        return res.status(404).send({
            success: false,
            message: 'The movie with the given ID was not found'
        });

    res.send({ success: true, movie });
});

export default router;
