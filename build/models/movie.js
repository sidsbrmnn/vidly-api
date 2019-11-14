"use strict";
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
const joi_1 = __importDefault(require("@hapi/joi"));
const mongoose_1 = __importStar(require("mongoose"));
const MovieSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    genre: { type: mongoose_1.Schema.Types.ObjectId, ref: 'genre', required: true },
    inStock: { type: Number, min: 0, required: true },
    rentalRate: { type: Number, min: 0, required: true }
});
function validateMovie(movie) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        genreId: joi_1.default.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        inStock: joi_1.default.number()
            .min(0)
            .required(),
        rentalRate: joi_1.default.number()
            .min(0)
            .required()
    });
    return schema.validate(movie);
}
exports.validateMovie = validateMovie;
exports.default = mongoose_1.default.model('movie', MovieSchema);
