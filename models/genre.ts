import { Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';
import mongoose, { Schema } from 'mongoose';

import { IGenre } from '../interfaces';

const GenreSchema: Schema = new Schema({
    name: { type: String, required: true }
});

export function validateGenre(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });

    next();
}

export default mongoose.model<IGenre>('genre', GenreSchema);
