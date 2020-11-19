import Joi, { ValidationResult } from 'joi';
import mongoose, { Document, Schema } from 'mongoose';
import { IGenre } from './genre';

interface IMovieInput {
    title: string;
    genre: IGenre['_id'];
    inStock: number;
    rentalRate: number;
}

export interface IMovie extends IMovieInput, Document {}

const MovieSchema: Schema = new Schema({
    title: { type: String, required: true },
    genre: { type: Schema.Types.ObjectId, ref: 'genre', required: true },
    inStock: { type: Number, min: 0, required: true },
    rentalRate: { type: Number, min: 0, required: true },
});

export function validateMovie(movie: IMovieInput): ValidationResult {
    const schema = Joi.object({
        title: Joi.string().required(),
        genreId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        inStock: Joi.number().min(0).required(),
        rentalRate: Joi.number().min(0).required(),
    });
    return schema.validate(movie, { stripUnknown: true, abortEarly: true });
}

const Movie = mongoose.model<IMovie>('movie', MovieSchema);

export default Movie;
