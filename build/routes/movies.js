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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = require("mongoose");
const genre_1 = __importDefault(require("../models/genre"));
const movie_1 = __importStar(require("../models/movie"));
const rental_1 = __importDefault(require("../models/rental"));
const router = express_1.default.Router();
router.use('/:id', (req, res, next) => {
    if (!mongoose_1.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send({
            success: false,
            message: 'The movie with the given ID was not found'
        });
    next();
});
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movies = yield movie_1.default.find()
        .populate('genre')
        .sort('title');
    res.send({ success: true, movies });
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = movie_1.validateMovie(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });
    const genre = yield genre_1.default.findOne({ _id: req.body.genreId });
    if (!genre)
        return res.status(400).send({
            success: false,
            message: 'Invalid genre'
        });
    const movie = new movie_1.default(Object.assign(Object.assign({}, lodash_1.default.pick(req.body, ['title', 'inStock', 'rentalRate'])), { genre: genre._id }));
    yield movie.save();
    res.send({ success: true, movie });
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = movie_1.validateMovie(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });
    const genre = yield genre_1.default.findOne({ _id: req.body.genreId });
    if (!genre)
        return res.status(400).send({
            success: false,
            message: 'Invalid genre'
        });
    const movie = yield movie_1.default.findOneAndUpdate({ _id: req.params.id }, Object.assign(Object.assign({}, lodash_1.default.pick(req.body, ['title', 'inStock', 'rentalRate'])), { genre: genre._id }), { new: true });
    if (!movie)
        return res.status(404).send({
            success: false,
            message: 'The movie with the given ID was not found'
        });
    res.send({ success: true, movie });
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield movie_1.default.findOne({ _id: req.params.id });
    if (!movie)
        return res.status(404).send({
            success: false,
            message: 'The movie with the given ID was not found'
        });
    const rentals = yield rental_1.default.find({ movie: movie._id });
    if (rentals.length)
        return res.status(400).send({
            success: false,
            message: 'The movie with the given ID cannot be deleted'
        });
    yield movie.remove();
    res.send({ success: true, movie });
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield movie_1.default.findOne({ _id: req.params.id }).populate('genre');
    if (!movie)
        return res.status(404).send({
            success: false,
            message: 'The movie with the given ID was not found'
        });
    res.send({ success: true, movie });
}));
exports.default = router;
