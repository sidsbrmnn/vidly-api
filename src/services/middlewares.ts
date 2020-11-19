import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import { Application } from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import error from '../middlewares/error';
import router from '../routes';

export function initialiseMiddlewares(app: Application): void {
    if (process.env.NODE_ENV === 'production') {
        app.use(logger('common'));
        app.use(helmet());
        app.use(cors());
        app.use(compression());
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use('/api', router);

    app.all('*', (req, res) => {
        res.sendStatus(404);
    });

    app.use(error);
}
