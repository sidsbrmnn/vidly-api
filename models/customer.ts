import { Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';
import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    phone: string;
    isGold: boolean;
}

interface ICustomerInput extends Document {
    name: ICustomer['name'];
    phone: ICustomer['phone'];
    isGold?: ICustomer['isGold'];
}

const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    isGold: { type: Boolean, default: false }
});

export function validateCustomer(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const schema = Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        isGold: Joi.boolean()
    });
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });

    next();
}

export default mongoose.model<ICustomer>('customer', CustomerSchema);
