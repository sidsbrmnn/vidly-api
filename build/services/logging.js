"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    process.on('uncaughtException', error => {
        console.log(error);
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, promise) => {
        console.log('Unhandled rejection at:', promise, 'Reason:', reason);
    });
}
exports.default = default_1;
