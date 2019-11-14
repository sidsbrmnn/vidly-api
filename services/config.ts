export default function() {
    const { MONGODB_URI, JWT_SECRET } = process.env;

    if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined.');

    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined.');
}
