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
const customer_1 = __importDefault(require("../models/customer"));
const movie_1 = __importDefault(require("../models/movie"));
const rental_1 = __importStar(require("../models/rental"));
const router = express_1.default.Router();
router.use('/:id', (req, res, next) => {
    if (!mongoose_1.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send({
            success: false,
            message: 'The rental with the given ID was not found'
        });
    next();
});
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rentals = yield rental_1.default.find().sort('-dateOut');
    res.send({ success: true, rentals });
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = rental_1.validateRental(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });
    const customer = yield customer_1.default.findOne({ _id: req.body.customerId });
    if (!customer)
        return res.status(400).send({
            success: false,
            message: 'Invalid customer'
        });
    const movie = yield movie_1.default.findOne({ _id: req.body.movieId });
    if (!movie)
        return res.status(400).send({
            success: false,
            message: 'Invalid movie'
        });
    if (movie.inStock === 0)
        return res.status(400).send({
            success: false,
            message: 'Movie not in stock'
        });
    const rental = new rental_1.default({
        customer: customer._id,
        movie: movie._id
    });
    yield Promise.all([rental.save(), movie.update({ $inc: { inStock: -1 } })]);
    res.send({ success: true, rental });
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rental = yield rental_1.default.findOne({ _id: req.params.id });
    if (!rental)
        return res.status(404).send({
            success: false,
            message: 'The rental with the given ID was not found'
        });
    res.send({ success: true, rental });
}));
exports.default = router;
