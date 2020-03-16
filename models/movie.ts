import { Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';
import mongoose, { Schema } from 'mongoose';

import Genre from './genre';
import { IMovie } from '../interfaces';

const MovieSchema: Schema = new Schema({
    title: { type: String, required: true },
    genre: { type: Schema.Types.ObjectId, ref: 'genre', required: true },
    inStock: { type: Number, min: 0, required: true },
    rentalRate: { type: Number, min: 0, required: true }
});

export async function validateMovie(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const schema = Joi.object({
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
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });

    const genre = await Genre.findOne({ _id: req.body.genreId });
    if (!genre)
        return res.status(400).send({
            success: false,
            message: 'Invalid genre'
        });

    next();
}

export default mongoose.model<IMovie>('movie', MovieSchema);
