import User from '../../../src/models/user';
import jwt from '../../../src/utils/jwt';

describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = { name: 'John Doe' };
        const user = new User({ ...payload });
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token);
        expect(decoded).toMatchObject(payload);
    });
});
