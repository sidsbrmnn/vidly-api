import express, { Request, Response } from 'express';
import _ from 'lodash';

import Rental, { validateRental } from '../models/rental';

const router = express.Router();

router.post('/', validateRental, async (req: Request, res: Response) => {
    const rental = await Rental.findOne({
        customer: res.locals.customer._id,
        movie: res.locals.movie._id
    }).populate('movie');
    if (!rental)
        return res.status(400).send({
            success: false,
            message: 'Invalid rental ID'
        });
    if (rental.dateReturned)
        return res.status(400).send({
            success: false,
            message: 'Return already processed'
        });

    rental.return();

    await Promise.all([
        rental.save(),
        res.locals.movie.updateOne({ $inc: { inStock: 1 } })
    ]);

    res.send({ success: true, rental });
});

export default router;
