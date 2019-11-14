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
const joi_1 = __importDefault(require("@hapi/joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});
UserSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        this.password = yield bcrypt_1.default.hash(this.password, salt);
    });
});
UserSchema.methods.generateAuthToken = function () {
    const token = jsonwebtoken_1.default.sign({
        _id: this._id,
        name: this.name,
        isAdmin: this.isAdmin
    }, process.env.JWT_SECRET);
    return token;
};
UserSchema.method('generateAuthToken', function () {
    const token = jsonwebtoken_1.default.sign({
        _id: this._id,
        name: this.name,
        isAdmin: this.isAdmin
    }, process.env.JWT_SECRET);
    return token;
});
function validateUser(user) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        email: joi_1.default.string()
            .email()
            .required(),
        password: joi_1.default.string().required(),
        phone: joi_1.default.string().required()
    });
    return schema.validate(user);
}
exports.validateUser = validateUser;
function validateLogin(user) {
    const schema = joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .required(),
        password: joi_1.default.string().required()
    });
    return schema.validate(user);
}
exports.validateLogin = validateLogin;
exports.default = mongoose_1.default.model('user', UserSchema);
