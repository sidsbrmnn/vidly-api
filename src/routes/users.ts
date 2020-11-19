import { Router } from 'express';
import User, { validateUser } from '../models/user';
import HttpError from '../utils/http-error';

const router = Router();

router.post('/', async (req, res) => {
    const { error, value } = validateUser(req.body);
    if (error) {
        throw new HttpError(400, error.details[0].message);
    }

    let user = await User.findOne({ email: value.email });
    if (user) {
        throw new HttpError(409, 'Email already exists. Please login.');
    }

    user = new User({ ...value });
    await user.hashPassword();
    await user.save();

    const token = user.generateAuthToken();
    res.send({ data: token });
});

export default router;
