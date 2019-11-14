import Joi, { ObjectSchema, ValidationResult } from '@hapi/joi';
import mongoose, { Schema, Document } from 'mongoose';

export interface IGenre extends Document {
    name: string;
}

interface IGenreInput extends Document {
    name: IGenre['name'];
}

const GenreSchema: Schema = new Schema({
    name: { type: String, required: true }
});

export function validateGenre(genre: IGenreInput): ValidationResult {
    const schema: ObjectSchema = Joi.object({
        name: Joi.string().required()
    });

    return schema.validate(genre);
}

export default mongoose.model<IGenre>('genre', GenreSchema);
