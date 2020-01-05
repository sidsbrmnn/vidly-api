import _ from 'lodash';
import express, { Request, Response, NextFunction } from 'express';

import User, { validateUser } from '../models/user';

const router = express.Router();

async function validateSignup(req: Request, res: Response, next: NextFunction) {
    const user = await User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send({
            success: false,
            message: 'User with the given email already exists'
        });

    next();
}

router.post(
    '/',
    [validateUser, validateSignup],
    async (req: Request, res: Response) => {
        const user = new User(_.pick(req.body, ['name', 'email', 'password']));
        await user.save();

        const token = user.generateAuthToken();

        res.send({ success: true, token });
    }
);

export default router;
