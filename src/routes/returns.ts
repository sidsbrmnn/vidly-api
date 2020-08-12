import { Router } from 'express';

import Customer from '../models/customer';
import Movie from '../models/movie';
import Rental, { validateRental } from '../models/rental';
import HttpError from '../utils/http-error';

const router = Router();

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

    const rental = await Rental.findOne({ ...value }).populate('movie');
    if (!rental) {
        throw new HttpError(400, 'Rental with the given ID was not found.');
    }
    if (rental.dateReturned) {
        throw new HttpError(405, 'Return has already been processed.');
    }

    rental.return();
    await Promise.all([
        rental.save(),
        movie.updateOne({ $inc: { inStock: 1 } }),
    ]);

    res.send({ data: rental });
});

export default router;
