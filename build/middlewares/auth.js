"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function default_1(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token)
        res.status(401).send({ success: false, message: 'No token provided' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send({ success: false, message: 'Invalid token' });
    }
}
exports.default = default_1;
