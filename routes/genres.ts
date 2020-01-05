import express, { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import Genre, { validateGenre } from '../models/genre';
import Movie from '../models/movie';

const router = express.Router();

router.use('/:id', (req: Request, res: Response, next: NextFunction) => {
    if (!Types.ObjectId.isValid(req.params.id))
        return res.status(404).send({
            success: false,
            message: 'The genre with the given ID was not found'
        });

    next();
});

router.get('/', async (req: Request, res: Response) => {
    const genres = await Genre.find().sort('name');

    res.send({ success: true, genres });
});

router.post('/', validateGenre, async (req: Request, res: Response) => {
    const genre = new Genre({ name: req.body.name });
    await genre.save();

    res.send({ success: true, genre });
});

router.put('/:id', validateGenre, async (req: Request, res: Response) => {
    const genre = await Genre.findOneAndUpdate(
        { _id: req.params.id },
        { name: req.body.name },
        { new: true }
    );
    if (!genre)
        return res.status(404).send({
            success: false,
            message: 'The genre with the given ID was not found'
        });

    res.send({ success: true, genre });
});

router.delete('/:id', async (req: Request, res: Response) => {
    const genre = await Genre.findOne({ _id: req.params.id });
    if (!genre)
        return res.status(404).send({
            success: false,
            message: 'The genre with the given ID was not found'
        });

    const movies = await Movie.find({ genre: genre._id });
    if (movies.length)
        return res.status(400).send({
            success: false,
            message: 'The genre with the given ID cannot be deleted'
        });

    await genre.remove();

    res.send({ success: true, genre });
});

router.get('/:id', async (req: Request, res: Response) => {
    const genre = await Genre.findOne({ _id: req.params.id });
    if (!genre)
        return res.status(404).send({
            success: false,
            message: 'The genre with the given ID was not found'
        });

    res.send({ success: true, genre });
});

export default router;
