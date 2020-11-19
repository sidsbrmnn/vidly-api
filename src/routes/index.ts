import { Router } from 'express';
import auth from '../middlewares/auth';
import authRouter from './auth';
import customersRouter from './customers';
import genresRouter from './genres';
import moviesRouter from './movies';
import rentalsRouter from './rentals';
import returnsRouter from './returns';
import usersRouter from './users';

const router = Router();

router.use('/auth', authRouter);
router.use('/customers', customersRouter);
router.use('/genres', genresRouter);
router.use('/movies', moviesRouter);
router.use('/rentals', auth, rentalsRouter);
router.use('/returns', auth, returnsRouter);
router.use('/users', usersRouter);

export default router;
