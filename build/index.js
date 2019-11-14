"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./services/config"));
const db_1 = __importDefault(require("./services/db"));
const logging_1 = __importDefault(require("./services/logging"));
const prod_1 = __importDefault(require("./services/prod"));
const routes_1 = __importDefault(require("./services/routes"));
const app = express_1.default();
logging_1.default();
config_1.default();
db_1.default();
if (process.env.NODE_ENV === 'production')
    prod_1.default(app);
routes_1.default(app);
const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
    console.log('Listening on port ' + port);
});
