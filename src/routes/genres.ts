import { Router } from 'express';

import auth from '../middlewares/auth';
import Genre, { validateGenre } from '../models/genre';
import HttpError from '../utils/http-error';

const router = Router();

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');

    res.send({ data: genres });
});

router.post('/', auth, async (req, res) => {
    const { error, value } = validateGenre(req.body);
    if (error) {
        throw new HttpError(400, error.details[0].message);
    }

    const genre = new Genre({ ...value });
    await genre.save();

    res.send({ data: genre });
});

export default router;
