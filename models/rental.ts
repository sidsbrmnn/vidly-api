import { Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';
import moment from 'moment';
import mongoose, { Schema } from 'mongoose';

import Customer from './customer';
import Movie from './movie';
import { IRental } from '../interfaces';

const RentalSchema: Schema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'movie',
        required: true
    },
    dateOut: { type: Date, default: Date.now },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0 }
});

RentalSchema.method('return', function() {
    this.dateReturned = new Date();
    const days = moment().diff(this.dateOut, 'days');

    this.rentalFee = days * this.movie.rentalRate;
});

export async function validateRental(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const schema = Joi.object({
        customerId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        movieId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
    });
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });

    const customer = await Customer.findOne({ _id: req.body.customerId });
    const movie = await Movie.findOne({ _id: req.body.movieId });
    if (!movie || !customer)
        return res.status(400).send({
            success: false,
            message: 'Invalid movie/customer'
        });

    res.locals.customer = customer;
    res.locals.movie = movie;
    next();
}

export default mongoose.model<IRental>('rental', RentalSchema);
