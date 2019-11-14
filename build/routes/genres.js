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
const mongoose_1 = require("mongoose");
const genre_1 = __importStar(require("../models/genre"));
const movie_1 = __importDefault(require("../models/movie"));
const router = express_1.default.Router();
router.use('/:id', (req, res, next) => {
    if (!mongoose_1.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send({
            success: false,
            message: 'The genre with the given ID was not found'
        });
    next();
});
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const genres = yield genre_1.default.find().sort('name');
    res.send({ success: true, genres });
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = genre_1.validateGenre(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });
    const genre = new genre_1.default({ name: req.body.name });
    yield genre.save();
    res.send({ success: true, genre });
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = genre_1.validateGenre(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });
    const genre = yield genre_1.default.findOneAndUpdate({ _id: req.params.id }, { name: req.body.name }, { new: true });
    if (!genre)
        return res.status(404).send({
            success: false,
            message: 'The genre with the given ID was not found'
        });
    res.send({ success: true, genre });
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const genre = yield genre_1.default.findOne({ _id: req.params.id });
    if (!genre)
        return res.status(404).send({
            success: false,
            message: 'The genre with the given ID was not found'
        });
    const movies = yield movie_1.default.find({ genre: genre._id });
    if (movies.length)
        return res.status(400).send({
            success: false,
            message: 'The genre with the given ID cannot be deleted'
        });
    yield genre.remove();
    res.send({ success: true, genre });
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const genre = yield genre_1.default.findOne({ _id: req.params.id });
    if (!genre)
        return res.status(404).send({
            success: false,
            message: 'The genre with the given ID was not found'
        });
    res.send({ success: true, genre });
}));
exports.default = router;
