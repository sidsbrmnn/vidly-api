import Joi, { ValidationResult } from 'joi';
import mongoose, { Document, Schema } from 'mongoose';

interface ICustomerInput {
    name: string;
    phone: string;
    isGold?: boolean;
}

export interface ICustomer extends ICustomerInput, Document {}

const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    isGold: { type: Boolean, default: false },
});

export function validateCustomer(customer: ICustomerInput): ValidationResult {
    const schema = Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        isGold: Joi.boolean(),
    });
    return schema.validate(customer, { stripUnknown: true, abortEarly: true });
}

const Customer = mongoose.model<ICustomer>('customer', CustomerSchema);

export default Customer;
