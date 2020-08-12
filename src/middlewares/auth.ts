import { Request, Response, NextFunction } from 'express';

import User from '../models/user';
import HttpError from '../utils/http-error';
import jwt from '../utils/jwt';

export default async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const value = req.headers.authorization;
    if (!value) {
        throw new HttpError(401, 'Please login to continue.');
    }

    const parts = value.split(' ');
    if (parts.length !== 2 || !parts[0].match(/^Bearer$/)) {
        throw new HttpError(401, 'Invalid authorization header signature.');
    }

    const decoded = jwt.verify(parts[1]);
    const user = await User.findOne({ _id: decoded.sub });
    if (!user) {
        throw new HttpError(401, 'Invalid session. Please login again.');
    }

    req.user = user;
    next();
}
