import { Request, Response, NextFunction } from 'express';

export default function(req: Request, res: Response, next: NextFunction) {
    if (!req.user.isAdmin)
        return res
            .status(403)
            .send({ success: false, message: 'Access denied' });

    next();
}
