"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function default_1() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/vidly';
    mongoose_1.default
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
exports.default = default_1;
