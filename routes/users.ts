import _ from 'lodash';
import express, { Request, Response } from 'express';

import User, { validateUser } from '../models/user';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { error } = validateUser(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });

    let user = await User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send({
            success: false,
            message: 'User with the given email already exists'
        });

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    await user.save();

    const token = user.generateAuthToken();

    res.send({ success: true, token });
});

export default router;
