import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default function(req: Request, res: Response, next: NextFunction) {
    const token = req.header('x-auth-token');
    if (!token)
        res.status(401).send({ success: false, message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (ex) {
        res.status(400).send({ success: false, message: 'Invalid token' });
    }
}
