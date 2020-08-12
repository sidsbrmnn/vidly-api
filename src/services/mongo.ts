import mongoose from 'mongoose';

export function connectMongo(): Promise<typeof mongoose> {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/vidly';
    return mongoose.connect(MONGO_URI, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}
