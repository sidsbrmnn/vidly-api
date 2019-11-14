"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(err, req, res, next) {
    console.log(err);
    res.status(500).send({ success: false, message: 'Something went wrong' });
}
exports.default = default_1;
