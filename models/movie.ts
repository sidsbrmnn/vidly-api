import Joi, { ObjectSchema, ValidationResult } from '@hapi/joi';
import mongoose, { Schema, Document } from 'mongoose';
import { IGenre } from './genre';

export interface IMovie extends Document {
    title: string;
    genre: IGenre['_id'];
    inStock: number;
    rentalRate: number;
}

export interface IMovieInput {
    title: IMovie['title'];
    genreId: IMovie['genre'];
    inStock: IMovie['inStock'];
    rentalRate: IMovie['rentalRate'];
}

const MovieSchema: Schema = new Schema({
    title: { type: String, required: true },
    genre: { type: Schema.Types.ObjectId, ref: 'genre', required: true },
    inStock: { type: Number, min: 0, required: true },
    rentalRate: { type: Number, min: 0, required: true }
});

export function validateMovie(movie: IMovieInput): ValidationResult {
    const schema: ObjectSchema = Joi.object({
        title: Joi.string().required(),
        genreId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        inStock: Joi.number()
            .min(0)
            .required(),
        rentalRate: Joi.number()
            .min(0)
            .required()
    });

    return schema.validate(movie);
}

export default mongoose.model<IMovie>('movie', MovieSchema);
