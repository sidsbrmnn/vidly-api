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
const CustomerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    isGold: { type: Boolean, default: false }
});
function validateCustomer(customer) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        phone: joi_1.default.string().required(),
        isGold: joi_1.default.boolean()
    });
    return schema.validate(customer);
}
exports.validateCustomer = validateCustomer;
exports.default = mongoose_1.default.model('customer', CustomerSchema);
