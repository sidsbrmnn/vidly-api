import Joi, { ValidationResult } from 'joi';
import moment from 'moment';
import mongoose, { Document, Schema } from 'mongoose';
import { ICustomer } from './customer';
import { IMovie } from './movie';

interface IRentalInput {
    customer: ICustomer['_id'];
    movie: IMovie['_id'];
}

export interface IRental extends IRentalInput, Document {
    dateOut: number;
    dateReturned?: number;
    rentalFee?: number;

    return(): void;
}

const RentalSchema: Schema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'customer',
        required: true,
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'movie',
        required: true,
    },
    dateOut: { type: Date, default: Date.now },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0 },
});

RentalSchema.methods.return = function () {
    this.dateReturned = new Date();
    const days = moment().diff(this.dateOut, 'days');

    this.rentalFee = days * this.movie.rentalRate;
};

export function validateRental(rental: IRentalInput): ValidationResult {
    const schema = Joi.object({
        customerId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        movieId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
    });
    return schema.validate(rental, { stripUnknown: true, abortEarly: true });
}

const Rental = mongoose.model<IRental>('rental', RentalSchema);

export default Rental;
