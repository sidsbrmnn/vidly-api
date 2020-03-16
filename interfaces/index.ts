import { Document } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    phone: string;
    isGold: boolean;
}

export interface IGenre extends Document {
    name: string;
}

export interface IMovie extends Document {
    title: string;
    genre: IGenre['_id'];
    inStock: number;
    rentalRate: number;
}

export interface IRental extends Document {
    customer: ICustomer['_id'];
    movie: IMovie['_id'];
    dateOut: Date;
    dateReturned?: Date;
    rentalFee?: number;
    return(): void;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    generateAuthToken(): string;
}
