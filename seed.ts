import mongoose from 'mongoose';

import Genre from './models/genre';
import Movie from './models/movie';

const data = [
    {
        name: 'Comedy',
        movies: [
            { title: 'Airplane', inStock: 5, rentalRate: 2 },
            { title: 'The Hangover', inStock: 10, rentalRate: 2 },
            { title: 'Wedding Crashers', inStock: 15, rentalRate: 2 }
        ]
    },
    {
        name: 'Action',
        movies: [
            { title: 'Die Hard', inStock: 5, rentalRate: 2 },
            { title: 'Terminator', inStock: 10, rentalRate: 2 },
            { title: 'The Avengers', inStock: 15, rentalRate: 2 }
        ]
    },
    {
        name: 'Romance',
        movies: [
            { title: 'The Notebook', inStock: 5, rentalRate: 2 },
            { title: 'When Harry Met Sally', inStock: 10, rentalRate: 2 },
            { title: 'Pretty Woman', inStock: 15, rentalRate: 2 }
        ]
    },
    {
        name: 'Thriller',
        movies: [
            { title: 'The Sixth Sense', inStock: 5, rentalRate: 2 },
            { title: 'Gone Girl', inStock: 10, rentalRate: 2 },
            { title: 'The Others', inStock: 15, rentalRate: 2 }
        ]
    }
];

async function seed() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/vidly';
    await mongoose.connect(MONGODB_URI, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await Movie.deleteMany({});
    await Genre.deleteMany({});

    for (const genre of data) {
        const { _id: genreId } = await new Genre({ name: genre.name }).save();
        const movies = genre.movies.map(movie => ({
            ...movie,
            genre: genreId
        }));
        await Movie.insertMany(movies);
    }

    mongoose.disconnect();

    console.log('Done!');
}

seed();
