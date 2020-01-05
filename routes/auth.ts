import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';

import User, { validateLogin } from '../models/user';

const router = express.Router();

router.post('/login', validateLogin, async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email });

    const validPassword = user
        ? await bcrypt.compare(req.body.password, user.password)
        : false;
    if (!validPassword)
        return res.status(403).send({
            success: false,
            message: 'Incorrect email/password'
        });

    const token = user.generateAuthToken();

    res.send({ success: true, token });
});

export default router;
