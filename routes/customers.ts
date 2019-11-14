import express, { Request, Response } from 'express';
import _ from 'lodash';

import Customer, { validateCustomer } from '../models/customer';
import Rental from '../models/rental';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const customers = await Customer.find().sort('name');

    res.send({ success: true, customers });
});

router.post('/', async (req: Request, res: Response) => {
    const { error } = validateCustomer(req.body);
    if (error)
        return res
            .status(400)
            .send({ success: false, message: error.details[0].message });

    const customer = new Customer(_.pick(req.body, ['name', 'phone']));
    await customer.save();

    res.send({ success: true, customer });
});

router.put('/:id', async (req: Request, res: Response) => {
    const { error } = validateCustomer(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });

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
