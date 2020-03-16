import express, { Request, Response } from 'express';
import _ from 'lodash';

import { isLoggedIn, isValidId } from '../middlewares';
import Customer, { validateCustomer } from '../models/customer';

const router = express.Router();

router.get('/', isLoggedIn, async (req: Request, res: Response) => {
    const customers = await Customer.find().sort('name');

    res.send({ success: true, customers });
});

router.post(
    '/',
    [isLoggedIn, validateCustomer],
    async (req: Request, res: Response) => {
        const customer = new Customer(_.pick(req.body, ['name', 'phone']));
        await customer.save();

        res.send({ success: true, customer });
    }
);

router.put(
    '/:id',
    [isLoggedIn, isValidId, validateCustomer],
    async (req: Request, res: Response) => {
        const customer = await Customer.findOneAndUpdate(
            { _id: req.params.id },
            _.pick(req.body, ['name', 'phone', 'isGold']),
            { new: true }
        );
        if (!customer)
            return res.status(400).send({
                success: false,
                message: 'Invalid customer Id'
            });

        res.send({ success: true, customer });
    }
);

router.get(
    '/:id',
    [isLoggedIn, isValidId],
    async (req: Request, res: Response) => {
        const customer = await Customer.findOne({ _id: req.params.id });
        if (!customer)
            return res.status(404).send({
                success: false,
                message: 'Customer not found'
            });

        res.send({ success: true, customer });
    }
);

export default router;
