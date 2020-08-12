import { Router } from 'express';
import { Types } from 'mongoose';

import auth from '../middlewares/auth';
import Customer, { validateCustomer } from '../models/customer';
import HttpError from '../utils/http-error';

const router = Router();

router.get('/', auth, async (req, res) => {
    const customers = await Customer.find().sort('name');

    res.send({ data: customers });
});

router.post('/', auth, async (req, res) => {
    const { error, value } = validateCustomer(req.body);
    if (error) {
        throw new HttpError(400, error.details[0].message);
    }

    const customer = new Customer({ ...value });
    await customer.save();

    res.send({ data: customer });
});

router.put('/:id', auth, async (req, res) => {
    if (!Types.ObjectId.isValid(req.params.id)) {
        throw new HttpError(404, 'Genre with given ID was not found.');
    }

    const { error, value } = validateCustomer(req.body);
    if (error) {
        throw new HttpError(400, error.details[0].message);
    }

    const customer = await Customer.findOneAndUpdate(
        { _id: req.params.id },
        { ...value },
        { new: true }
    );
    if (!customer) {
        throw new HttpError(404, 'Customer with given ID was not found.');
    }

    res.send({ data: customer });
});

router.get('/:id', auth, async (req, res) => {
    if (!Types.ObjectId.isValid(req.params.id)) {
        throw new HttpError(404, 'Customer with given ID was not found.');
    }

    const customer = await Customer.findOne({ _id: req.params.id });
    if (!customer) {
        throw new HttpError(404, 'Customer with given ID was not found.');
    }

    res.send({ data: customer });
});

export default router;
