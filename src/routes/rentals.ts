import { Router } from 'express';
import { Types } from 'mongoose';

import Customer from '../models/customer';
import Movie from '../models/movie';
import Rental, { validateRental } from '../models/rental';
import HttpError from '../utils/http-error';

const router = Router();

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');

    res.send({ data: rentals });
});

router.post('/', async (req, res) => {
    const { error, value } = validateRental(req.body);
    if (error) {
        throw new HttpError(400, error.details[0].message);
    }

    const movie = await Movie.findOne({ _id: value.movie });
    if (!movie) {
        throw new HttpError(400, 'Movie with the given ID was not found.');
    }
    const customer = await Customer.findOne({ _id: value.customer });
    if (!customer) {
        throw new HttpError(400, 'Customer with the given ID was not found.');
    }

    let rental = await Rental.findOne({ ...value });
    if (rental) {
        throw new HttpError(409, 'Customer has already rented this movie.');
    }
    if (movie.inStock === 0) {
        throw new HttpError(405, 'Movie not in stock.');
    }

    rental = new Rental({ ...value });
    await Promise.all([
        rental.save(),
        movie.updateOne({ $inc: { inStock: -1 } }),
    ]);

    res.send({ data: rental });
});

router.get('/:id', async (req, res) => {
    if (!Types.ObjectId.isValid(req.params.id)) {
        throw new HttpError(404, 'Rental with the given ID was not found.');
    }

    const rental = await Rental.findOne({ _id: req.params.id });
    if (!rental) {
        throw new HttpError(404, 'Rental with the given ID was not found.');
    }

    res.send({ data: rental });
});

export default router;
