import express, { Application, Request, Response } from 'express';

import error from '../middlewares/error';

import auth from '../routes/auth';
import customers from '../routes/customers';
import genres from '../routes/genres';
import movies from '../routes/movies';
import rentals from '../routes/rentals';
import returns from '../routes/returns';
import users from '../routes/users';

export default function(app: Application) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/api/auth', auth);
    app.use('/api/customers', customers);
    app.use('/api/genres', genres);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/returns', returns);
    app.use('/api/users', users);

    app.all('*', (req: Request, res: Response) => {
        res.status(404).send({ success: false, message: '' });
    });
    app.use(error);
}
