import dotenv from 'dotenv';
import express from 'express';
import './services/logging';
import { initialiseMiddlewares } from './services/middlewares';
import { connectMongo } from './services/mongo';

dotenv.config();
const app = express();

(async () => {
    await connectMongo();
    console.log('Connected to MongoDB');

    initialiseMiddlewares(app);

    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    app.listen(PORT, () => {
        console.log(`Listening on port :${PORT}`);
    });
})();
