import crypto from 'crypto';
import jwt, { Secret } from 'jsonwebtoken';

import { IUser } from '../models/user';

interface IPayload {
    sub: IUser['_id'];
    name: IUser['name'];
}

interface ITokenPayload extends IPayload {
    iat: number;
    exp?: number;
}

class Jwt {
    private secret: Secret;

    constructor() {
        this.secret = process.env.JWT_SECRET || this.generateSecret();
    }

    private generateSecret() {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Synchronously sign the given payload into a JSON Web Token string
     */
    public sign(payload: IPayload) {
        return jwt.sign(payload, this.secret);
    }

    /**
     * Synchronously verify given token using a secret or a public key to get a decoded token
     */
    public verify(token: string) {
        return jwt.verify(token, this.secret) as ITokenPayload;
    }
}

export default new Jwt();
