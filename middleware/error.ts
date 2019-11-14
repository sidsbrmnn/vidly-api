import { Request, Response, NextFunction } from 'express';

export default function(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(err);
    res.status(500).send({ success: false, message: 'Something went wrong' });
}
