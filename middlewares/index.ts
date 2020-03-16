import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export function handleError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(err.message);
    res.status(500).send({
        success: false,
        message: 'Something went wrong'
    });
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.user.isAdmin)
        return res.status(403).send({
            success: false,
            message: 'You are not allowed to perform this action'
        });

    next();
}

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    const token = req.header('x-auth-token');
    if (!token)
        res.status(401).send({
            success: false,
            message: 'No token provided'
        });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.user = decoded;

        next();
    } catch (ex) {
        res.status(400).send({
            success: false,
            message: 'Invalid token'
        });
    }
}

export function isValidId(req: Request, res: Response, next: NextFunction) {
    if (!Types.ObjectId.isValid(req.params.id))
        return res.status(400).send({ success: false, message: 'Invalid Id' });

    next();
}
