import { Router } from 'express';
import User from '../models/user';
import HttpError from '../utils/http-error';

const router = Router();

router.post('/', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        throw new HttpError(401, 'Invalid email/password.');
    }

    const same = user.comparePassword(req.body.password);
    if (!same) {
        throw new HttpError(403, 'Invalid email/password.');
    }

    const token = user.generateAuthToken();
    res.send({ data: token });
});

export default router;
