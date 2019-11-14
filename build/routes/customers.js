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
const express_1 = __importDefault(require("express"));
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = require("mongoose");
const customer_1 = __importStar(require("../models/customer"));
const rental_1 = __importDefault(require("../models/rental"));
const router = express_1.default.Router();
router.use('/:id', (req, res, next) => {
    if (!mongoose_1.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send({
            success: false,
            message: 'The customer with the given ID was not found'
        });
    next();
});
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customers = yield customer_1.default.find().sort('name');
    res.send({ success: true, customers });
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = customer_1.validateCustomer(req.body);
    if (error)
        return res
            .status(400)
            .send({ success: false, message: error.details[0].message });
    const customer = new customer_1.default(lodash_1.default.pick(req.body, ['name', 'phone']));
    yield customer.save();
    res.send({ success: true, customer });
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = customer_1.validateCustomer(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });
    const customer = yield customer_1.default.findOneAndUpdate({ _id: req.params.id }, lodash_1.default.pick(req.body, ['name', 'phone', 'isGold']), { new: true });
    if (!customer)
        return res.status(404).send({
            success: false,
            message: 'The customer with the given ID was not found'
        });
    res.send({ success: true, customer });
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield customer_1.default.findOne({ _id: req.params.id });
    if (!customer)
        return res.status(404).send({
            success: false,
            message: 'The customer with the given ID was not found'
        });
    const rentals = yield rental_1.default.find({ customer: customer._id });
    if (rentals.length)
        return res.status(400).send({
            success: false,
            message: 'The customer with the given ID cannot be deleted'
        });
    yield customer.remove();
    res.send({ success: true, customer });
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield customer_1.default.findOne({ _id: req.params.id });
    if (!customer)
        return res.status(404).send({
            success: false,
            message: 'The customer with the given ID was not found'
        });
    res.send({ success: true, customer });
}));
exports.default = router;
