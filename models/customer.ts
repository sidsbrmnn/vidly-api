import Joi, { Schema as JoiSchema } from '@hapi/joi';
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

export function validateCustomer(customer: ICustomerInput): object {
    const schema: JoiSchema = Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        isGold: Joi.boolean()
    });

    return schema.validate(customer);
}

export default mongoose.model<ICustomer>('customer', CustomerSchema);
