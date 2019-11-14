import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';

import User, { validateLogin } from '../models/user';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
    const { error } = validateLogin(req.body);
    if (error)
        return res
            .status(400)
            .send({ success: false, message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return res
            .status(401)
            .send({ success: false, message: 'Invalid email/password' });

    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!validPassword)
        return res
            .status(401)
            .send({ success: false, message: 'Incorrect password' });

    const token = user.generateAuthToken();

    res.send({ success: true, token });
});

export default router;
