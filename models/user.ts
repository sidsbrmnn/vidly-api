import bcrypt from 'bcrypt';
import Joi, { ObjectSchema, ValidationResult } from '@hapi/joi';
import jwt from 'jsonwebtoken';
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    generateAuthToken(): string;
}

interface IUserInput {
    name: IUser['name'];
    email: IUser['email'];
    password: IUser['password'];
    isAdmin?: IUser['isAdmin'];
}

interface ILoginInput {
    email: IUser['email'];
    password: IUser['password'];
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});

UserSchema.pre<IUser>('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.generateAuthToken = function(): string {
    const token = jwt.sign(
        {
            _id: this._id,
            name: this.name,
            isAdmin: this.isAdmin
        },
        process.env.JWT_SECRET
    );

    return token;
};

UserSchema.method('generateAuthToken', function(): string {
    const token = jwt.sign(
        {
            _id: this._id,
            name: this.name,
            isAdmin: this.isAdmin
        },
        process.env.JWT_SECRET
    );

    return token;
});

export function validateUser(user: IUserInput): ValidationResult {
    const schema: ObjectSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string().required(),
        phone: Joi.string().required()
    });

    return schema.validate(user);
}

export function validateLogin(user: ILoginInput): ValidationResult {
    const schema: ObjectSchema = Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string().required()
    });

    return schema.validate(user);
}

export default mongoose.model<IUser>('user', UserSchema);
