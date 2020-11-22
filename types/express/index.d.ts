declare namespace Express {
    interface Request {
        user?: import('../../src/models/user').IUser;
    }
}
