import express, { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { Types } from 'mongoose';

import Rental, { validateRental } from '../models/rental';

const router = express.Router();

router.use('/:id', (req: Request, res: Response, next: NextFunction) => {
    if (!Types.ObjectId.isValid(req.params.id))
        return res.status(404).send({
            success: false,
            message: 'The rental with the given ID was not found'
        });

    next();
});

router.get('/', async (req: Request, res: Response) => {
    const rentals = await Rental.find().sort('-dateOut');

    res.send({ success: true, rentals });
});

router.post('/', validateRental, async (req: Request, res: Response) => {
    let rental = await Rental.findOne({
        customer: res.locals.customer._id,
        movie: res.locals.movie._id
    });
    if (res.locals.rental)
        return res.status(400).send({
            success: false,
            message: 'Customer has already rented this movie'
        });

    if (res.locals.movie.inStock === 0)
        return res.status(400).send({
            success: false,
            message: 'Movie not in stock'
        });

    rental = new Rental({
        customer: res.locals.customer._id,
        movie: res.locals.movie._id
    });
    await Promise.all([
        rental.save(),
        res.locals.movie.updateOne({ $inc: { inStock: -1 } })
    ]);

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
