"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    const { MONGODB_URI, JWT_SECRET } = process.env;
    if (!MONGODB_URI)
        throw new Error('MONGODB_URI is not defined.');
    if (!JWT_SECRET)
        throw new Error('JWT_SECRET is not defined.');
}
exports.default = default_1;
