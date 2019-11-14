import express, { Request, Response } from 'express';
import _ from 'lodash';

import Customer from '../models/customer';
import Movie from '../models/movie';
import Rental, { validateRental } from '../models/rental';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const rentals = await Rental.find().sort('-dateOut');

    res.send({ success: true, rentals });
});

router.post('/', async (req: Request, res: Response) => {
    const { error } = validateRental(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });

    const customer = await Customer.findOne({ _id: req.body.customerId });
    if (!customer)
        return res.status(400).send({
            success: false,
            message: 'Invalid customer'
        });

    const movie = await Movie.findOne({ _id: req.body.movieId });
    if (!movie)
        return res.status(400).send({
            success: false,
            message: 'Invalid movie'
        });
    if (movie.inStock === 0)
        return res.status(400).send({
            success: false,
            message: 'Movie not in stock'
        });

    const rental = new Rental({
        customer: customer._id,
        movie: movie._id
    });
    await Promise.all([rental.save(), movie.update({ $inc: { inStock: -1 } })]);

    res.send({ success: true, rental });
});

router.get('/:id', async (req: Request, res: Response) => {
    const rental = await Rental.findOne({ _id: req.params.id });
    if (!rental)
        return res.status(404).send({
            success: false,
            message: 'The rental with the given ID was not found'
        });

    res.send({ success: true, rental });
});

export default router;
