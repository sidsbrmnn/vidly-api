import compression from 'compression';
import cors from 'cors';
import { Application } from 'express';
import helmet from 'helmet';
import logger from 'morgan';

export default function(app: Application) {
    app.use(logger('dev'));
    app.use(helmet());
    app.use(cors());
    app.use(compression());
}
