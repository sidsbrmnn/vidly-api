"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
    if (!req.user.isAdmin)
        return res
            .status(403)
            .send({ success: false, message: 'Access denied' });
    next();
}
exports.default = default_1;
