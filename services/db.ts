import mongoose from 'mongoose';

export default function() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/vidly';

    mongoose
        .connect(MONGODB_URI, {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('Connected to MongoDB');
        });
}
