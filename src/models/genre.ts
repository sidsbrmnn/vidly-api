import Joi, { ValidationResult } from 'joi';
import mongoose, { Document, Schema } from 'mongoose';

interface IGenreInput {
    name: string;
}

export interface IGenre extends IGenreInput, Document {}

const GenreSchema = new Schema({
    name: { type: String, required: true },
});

export function validateGenre(user: IGenreInput): ValidationResult {
    const schema = Joi.object({
        name: Joi.string().required(),
    });
    return schema.validate(user, { stripUnknown: true, abortEarly: true });
}

const Genre = mongoose.model<IGenre>('genre', GenreSchema);

export default Genre;
