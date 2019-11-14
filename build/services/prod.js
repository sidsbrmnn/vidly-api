"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
function default_1(app) {
    app.use(morgan_1.default('dev'));
    app.use(helmet_1.default());
    app.use(cors_1.default());
    app.use(compression_1.default());
}
exports.default = default_1;
