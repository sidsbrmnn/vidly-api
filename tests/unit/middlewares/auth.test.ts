import { Request, Response } from 'express';
import { Mongoose } from 'mongoose';
import auth from '../../../src/middlewares/auth';
import User, { IUser } from '../../../src/models/user';
import { connectMongo } from '../../../src/services/mongo';

describe('auth middleware', () => {
    let connection: Mongoose;
    let user: IUser;

    beforeAll(async () => {
        connection = await connectMongo();
        user = new User({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'j0hndoE123',
        });
        await user.save();
    });

    afterAll(async () => {
        await User.deleteMany({});
        await connection.disconnect();
    });

    it('should populate req.user with the user decoded from JWT', async () => {
        const req = {
            headers: {
                authorization: 'Bearer ' + user.generateAuthToken(),
            },
        } as Request;
        const res = {} as Response;
        const next = jest.fn();

        await auth(req, res, next);

        expect(req.user?.toJSON()).toMatchObject(user.toJSON());
    });
});
