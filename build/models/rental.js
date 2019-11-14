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
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importStar(require("mongoose"));
const RentalSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    movie: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'movie',
        required: true
    },
    dateOut: { type: Date, default: Date.now },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0 }
});
RentalSchema.method('return', function () {
    this.dateReturned = new Date();
    const days = moment_1.default().diff(this.dateOut, 'days');
    this.rentalFee = days * this.movie.dailyRentalRate;
});
function validateRental(rental) {
    const schema = joi_1.default.object({
        customerId: joi_1.default.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        movieId: joi_1.default.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
    });
    return schema.validate(rental);
}
exports.validateRental = validateRental;
exports.default = mongoose_1.default.model('rental', RentalSchema);
