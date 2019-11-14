import express, { Application } from 'express';

import error from '../middlewares/error';

import auth from '../routes/auth';
import genres from '../routes/genres';
import users from '../routes/users';

export default function(app: Application) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/api/auth', auth);
    app.use('/api/genres', genres);
    app.use('/api/users', users);

    app.use(error);
}
