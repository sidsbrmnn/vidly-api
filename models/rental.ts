import Joi, { Schema as JoiSchema } from '@hapi/joi';
import moment from 'moment';
import mongoose, { Schema, Document } from 'mongoose';

import { ICustomer } from './customer';
import { IMovie } from './movie';

export interface IRental extends Document {
    customer: ICustomer['_id'];
    movie: IMovie['_id'];
    dateOut: Date;
    dateReturned: Date;
    rentalFee: number;
}

export interface IRentalInput {
    customerId: IRental['customer'];
    movieId: IRental['movie'];
}

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
    dateOut: { type: Date, default: Date.now }
});

RentalSchema.static('lookup', function(rental: IRentalInput): object {
    return this.findOne({
        customer: rental.customerId,
        movie: rental.movieId
    })
        .populate('customer')
        .populate('movie');
});

RentalSchema.method('return', function() {
    this.dateReturned = new Date();
    const days = moment().diff(this.dateOut, 'days');
    this.rentalFee = days * this.movie.dailyRentalRate;
});

export function validateRental(rental: IRentalInput): object {
    const schema: JoiSchema = Joi.object({
        customerId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        movieId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
    });

    return schema.validate(rental);
}

export default mongoose.model<IRental>('rental', RentalSchema);
