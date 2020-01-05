import express, { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { Types } from 'mongoose';

import Customer, { validateCustomer } from '../models/customer';
import Rental from '../models/rental';

const router = express.Router();

router.use('/:id', (req: Request, res: Response, next: NextFunction) => {
    if (!Types.ObjectId.isValid(req.params.id))
        return res.status(404).send({
            success: false,
            message: 'The customer with the given ID was not found'
        });

    next();
});

router.get('/', async (req: Request, res: Response) => {
    const customers = await Customer.find().sort('name');

    res.send({ success: true, customers });
});

router.post('/', validateCustomer, async (req: Request, res: Response) => {
    const customer = new Customer(_.pick(req.body, ['name', 'phone']));
    await customer.save();

    res.send({ success: true, customer });
});

router.put('/:id', validateCustomer, async (req: Request, res: Response) => {
    const customer = await Customer.findOneAndUpdate(
        { _id: req.params.id },
        _.pick(req.body, ['name', 'phone', 'isGold']),
        { new: true }
    );
    if (!customer)
        return res.status(404).send({
            success: false,
            message: 'The customer with the given ID was not found'
        });

    res.send({ success: true, customer });
});

router.delete('/:id', async (req: Request, res: Response) => {
    const customer = await Customer.findOne({ _id: req.params.id });
    if (!customer)
        return res.status(404).send({
            success: false,
            message: 'The customer with the given ID was not found'
        });

    const rentals = await Rental.find({ customer: customer._id });
    if (rentals.length)
        return res.status(400).send({
            success: false,
            message: 'The customer with the given ID cannot be deleted'
        });

    await customer.remove();

    res.send({ success: true, customer });
});

router.get('/:id', async (req: Request, res: Response) => {
    const customer = await Customer.findOne({ _id: req.params.id });
    if (!customer)
        return res.status(404).send({
            success: false,
            message: 'The customer with the given ID was not found'
        });

    res.send({ success: true, customer });
});

export default router;
