/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import HttpError from '../utils/http-error';

export default function (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err instanceof HttpError) {
        res.status(err.statusCode).send({ data: err.message });
    } else if (err instanceof JsonWebTokenError) {
        res.status(401).send({ data: 'Invalid session. Please login again.' });
    } else {
        res.status(500).send({ data: err.message });
    }
}
