"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const user_1 = __importStar(require("../models/user"));
const router = express_1.default.Router();
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = user_1.validateLogin(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });
    const user = yield user_1.default.findOne({ email: req.body.email });
    if (!user)
        return res.status(401).send({
            success: false,
            message: 'Invalid email/password'
        });
    const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(401).send({
            success: false,
            message: 'Incorrect password'
        });
    const token = user.generateAuthToken();
    res.send({ success: true, token });
}));
exports.default = router;
