"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const genre_1 = __importDefault(require("./models/genre"));
const movie_1 = __importDefault(require("./models/movie"));
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
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/vidly';
        yield mongoose_1.default.connect(MONGODB_URI, {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        yield movie_1.default.deleteMany({});
        yield genre_1.default.deleteMany({});
        for (const genre of data) {
            const { _id: genreId } = yield new genre_1.default({ name: genre.name }).save();
            const movies = genre.movies.map(movie => (Object.assign(Object.assign({}, movie), { genre: genreId })));
            yield movie_1.default.insertMany(movies);
        }
        mongoose_1.default.disconnect();
        console.log('Done!');
    });
}
seed();
