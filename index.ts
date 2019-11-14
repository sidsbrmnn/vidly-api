import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';

import config from './services/config';
import db from './services/db';
import logging from './services/logging';
import prod from './services/prod';
import routes from './services/routes';

const app: Application = express();

logging();
config();
db();
if (process.env.NODE_ENV === 'production') prod(app);
routes(app);

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
    console.log('Listening on port ' + port);
});
